module Api
  class CompletionsController < ApplicationController
    before_action :require_auth!

    def index
      from_date = params[:from] ? Date.parse(params[:from]) : 1.year.ago.to_date
      to_date = params[:to] ? Date.parse(params[:to]) : Date.current

      completions_by_plan_id = current_user.completions
        .where(on_date: from_date..to_date)
        .group_by(&:plan_id)

      result = {}
      current_user.subscriptions.active.includes(:plan).each do |sub|
        plan_code = sub.plan.code
        plan_id = sub.plan_id
        result[plan_code] = {}

        dates_with_completion = {}
        (completions_by_plan_id[plan_id] || []).each do |c|
          dates_with_completion[c.on_date] = true
        end
        (from_date..to_date).each do |date|
          result[plan_code][date.to_s] = !!dates_with_completion[date]
        end
      end

      render json: result
    end

    def create
      plan = Plan.find(params[:planId])
      # Use user timezone for default date
      date = params[:date] ? Date.parse(params[:date]) : today_in_zone(user_time_zone)
      reading_ref = params[:readingRef] || "Reading for #{date}"
      
      completion = current_user.completions.find_or_create_by!(
        plan: plan,
        on_date: date
      ) do |c|
        c.reading_ref = reading_ref
        c.completed_at = Time.current
      end

      render json: { 
        id: completion.id,
        plan_id: completion.plan_id,
        on_date: completion.on_date,
        reading_ref: completion.reading_ref,
        completed_at: completion.completed_at
      }
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Plan not found' }, status: :not_found
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.record.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end
end
