module Api
  class SubscriptionsController < ApplicationController
    before_action :require_auth!

    def index
      subs = current_user.subscriptions.includes(:plan).order(created_at: :desc)
      render json: subs.as_json(only: [:id, :plan_id, :start_date, :settings, :active, :timezone_override], include: { plan: { only: [:id, :code, :name, :description] } })
    end

    def create
      plan_code = params[:planCode]
      plan = Plan.find_by!(code: plan_code)
      sub = current_user.subscriptions.find_or_initialize_by(plan: plan)
      sub.start_date ||= Date.current
      sub.active = true
      sub.settings = params[:settings] if params.key?(:settings)
      sub.timezone_override = params[:timezone] if params.key?(:timezone)
      sub.save!
      render json: sub.as_json(only: [:id, :plan_id, :start_date, :settings, :active, :timezone_override]), status: :created
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Plan not found' }, status: :not_found
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.record.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end

    def update
      sub = current_user.subscriptions.find(params[:id])
      sub.active = params[:active] unless params[:active].nil?
      sub.settings = params[:settings] if params.key?(:settings)
      sub.timezone_override = params[:timezone] if params.key?(:timezone)
      sub.save!
      render json: sub.as_json(only: [:id, :plan_id, :start_date, :settings, :active, :timezone_override])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Subscription not found' }, status: :not_found
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.record.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end
end


