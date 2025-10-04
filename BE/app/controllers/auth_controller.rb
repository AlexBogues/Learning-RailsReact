class AuthController < ApplicationController
  skip_before_action :verify_authenticity_token

  def register
    email = params.require(:email)
    password = params.require(:password)
    timezone = params[:timezone].presence || "UTC"

    supabase = SupabaseClient.new
    result = supabase.sign_up(email: email, password: password)

    unless result[:success]
      render json: { error: result[:error] }, status: (result[:status] || :bad_request) and return
    end

    supabase_user_id = result.dig(:data, "user", "id") || result.dig(:data, "id")
    if supabase_user_id.blank?
      render json: { error: "Unable to obtain Supabase user id" }, status: :bad_gateway and return
    end

    user = User.find_or_initialize_by(supabase_user_id: supabase_user_id)
    user.email = email
    user.timezone = timezone
    if user.save
      render json: { user: { id: user.id, email: user.email, timezone: user.timezone, supabase_user_id: user.supabase_user_id } }, status: :created
    else
      render json: { error: user.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  rescue ActionController::ParameterMissing => e
    render json: { error: e.message }, status: :bad_request
  end

  def login
    email = params.require(:email)
    password = params.require(:password)

    supabase = SupabaseClient.new
    result = supabase.sign_in(email: email, password: password)

    unless result[:success]
      render json: { error: result[:error] }, status: (result[:status] || :unauthorized) and return
    end

    access_token = result.dig(:data, "access_token")
    refresh_token = result.dig(:data, "refresh_token")
    user_info = result.dig(:data, "user")
    supabase_user_id = user_info && user_info["id"]

    user = User.find_by(supabase_user_id: supabase_user_id) || User.find_by(email: email)
    unless user
      render json: { error: "User not found" }, status: :unauthorized and return
    end

    render json: {
      user: { id: user.id, email: user.email, timezone: user.timezone, supabase_user_id: user.supabase_user_id },
      session: { access_token: access_token, refresh_token: refresh_token }
    }, status: :ok
  rescue ActionController::ParameterMissing => e
    render json: { error: e.message }, status: :bad_request
  end

  def confirm
    # This action handles email confirmation redirects from Supabase
    render :confirm
  end
end


