module Api
  class StreaksController < ApplicationController
    before_action :require_auth!

    def index
      active_subs = current_user.subscriptions.active.includes(:plan)
      today = today_in_zone(user_time_zone)
      
      streaks = active_subs.map do |sub|
        plan_completions = current_user.completions
          .where(plan: sub.plan)
          .order(:on_date)
          .pluck(:on_date)
        
        current_streak = calculate_current_streak(plan_completions, today)
        longest_streak = calculate_longest_streak(plan_completions)
        
        {
          plan_code: sub.plan.code,
          plan_name: sub.plan.name,
          current_streak: current_streak,
          longest_streak: longest_streak
        }
      end

      # Combined streak (any plan completed on a day counts)
      all_completion_dates = current_user.completions
        .joins(:plan)
        .where(plans: { id: active_subs.map(&:plan_id) })
        .distinct
        .order(:on_date)
        .pluck(:on_date)
      
      combined_current = calculate_current_streak(all_completion_dates, today)
      combined_longest = calculate_longest_streak(all_completion_dates)

      render json: {
        plans: streaks,
        combined: {
          current_streak: combined_current,
          longest_streak: combined_longest
        }
      }
    end

    private

    def calculate_current_streak(completion_dates, today)
      return 0 if completion_dates.empty?
      
      streak = 0
      current_date = today
      
      while completion_dates.include?(current_date)
        streak += 1
        current_date -= 1.day
      end
      
      streak
    end

    def calculate_longest_streak(completion_dates)
      return 0 if completion_dates.empty?
      
      longest = 0
      current = 0
      prev_date = nil
      
      completion_dates.each do |date|
        if prev_date.nil? || date == prev_date + 1.day
          current += 1
        else
          longest = [longest, current].max
          current = 1
        end
        prev_date = date
      end
      
      [longest, current].max
    end
  end
end
