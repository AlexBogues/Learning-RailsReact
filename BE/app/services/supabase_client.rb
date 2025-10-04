class SupabaseClient
  class Error < StandardError; end

  def initialize
    @base_url = ENV["SUPABASE_URL"]
    @api_key = ENV["SUPABASE_ANON_KEY"]

    raise Error, "Missing SUPABASE_URL" if @base_url.to_s.strip.empty?
    raise Error, "Missing SUPABASE_ANON_KEY" if @api_key.to_s.strip.empty?

    @connection = Faraday.new(url: "#{@base_url.to_s.chomp('/')}\/auth\/v1") do |f|
      f.request :json
      f.response :json, content_type: /\bjson$/
      f.options.timeout = 5
      f.options.open_timeout = 2
      f.adapter Faraday.default_adapter
    end
  end

  def sign_up(email:, password:)
    response = @connection.post("signup") do |req|
      req.headers["apikey"] = @api_key
      req.headers["Authorization"] = "Bearer #{@api_key}"
      req.body = { email: email, password: password }
    end
    build_result(response)
  end

  def sign_in(email:, password:)
    response = @connection.post("token?grant_type=password") do |req|
      req.headers["apikey"] = @api_key
      req.headers["Authorization"] = "Bearer #{@api_key}"
      req.body = { email: email, password: password }
    end
    build_result(response)
  end

  # Fetch the current user for a given access token
  # Docs: GET /auth/v1/user with Authorization: Bearer <access_token>
  def get_user(access_token:)
    response = @connection.get("user") do |req|
      req.headers["apikey"] = @api_key
      req.headers["Authorization"] = "Bearer #{access_token}"
    end
    build_result(response)
  end

  private

  def build_result(response)
    if response.success?
      { success: true, data: response.body }
    else
      message = extract_error_message(response)
      { success: false, error: message, status: response.status }
    end
  end

  def extract_error_message(response)
    body = response.body
    if body.is_a?(Hash)
      body["message"] || body["error_description"] || body["error"] || body.inspect
    else
      body.to_s
    end
  end
end


