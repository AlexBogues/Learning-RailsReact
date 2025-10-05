class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  protect_from_forgery with: :null_session

  private

  def current_user
    return @current_user if defined?(@current_user)
    auth = request.headers["Authorization"].to_s
    token = auth.start_with?("Bearer ") ? auth.split(" ", 2).last : nil
    if token.blank?
      @current_user = nil
      return nil
    end

    supabase = SupabaseClient.new
    result = supabase.get_user(access_token: token)
    unless result[:success]
      @current_user = nil
      return nil
    end
    supabase_user_id = result.dig(:data, "id")
    email = result.dig(:data, "email")
    @current_user = User.find_or_create_by!(supabase_user_id: supabase_user_id) do |u|
      u.email = email || "user-#{SecureRandom.hex(4)}@example.com"
      u.timezone = "UTC"
    end
  rescue StandardError
    @current_user = nil
  end

  def require_auth!
    head :unauthorized unless current_user
  end

  def user_time_zone
    tz = current_user&.timezone.presence || "UTC"
    ActiveSupport::TimeZone[tz] ? tz : "UTC"
  end

  def subscription_time_zone(subscription)
    tz = subscription&.timezone_override.presence || user_time_zone
    ActiveSupport::TimeZone[tz] ? tz : user_time_zone
  end

  def today_in_zone(tz)
    Time.now.in_time_zone(tz).to_date
  end
end
