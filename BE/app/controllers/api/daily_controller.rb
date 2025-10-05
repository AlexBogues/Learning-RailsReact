module Api
  class DailyController < ApplicationController
    before_action :require_auth!

    def index
      today = today_in_zone(user_time_zone)
      active_subs = current_user.subscriptions.active.includes(:plan)

      assignments = active_subs.map do |sub|
        case sub.plan.code
        when 'proverb_of_day'
          chapter = [today.day, 31].min
          {
            subscription_id: sub.id,
            plan_id: sub.plan_id,
            plan_code: sub.plan.code,
            plan_name: sub.plan.name,
            reading_ref: "Proverbs #{chapter}",
            completed: current_user.completions.exists?(plan: sub.plan, on_date: today)
          }
        when 'daily_chapter'
          
          days_since_start = (today - sub.start_date).to_i
          settings = (sub.settings || {})
          start_book_name = settings['startBook'] || 'Genesis'
          start_chapter = settings['startChapter'].to_i
          start_chapter = 1 if start_chapter <= 0

          books = Book.order(:position).select(:name, :chapter_count).to_a
          if books.empty?
            # Fallback if canon not seeded
            chapter_num = 1 + days_since_start
            chapter_num = ((chapter_num - 1) % 50) + 1
            next {
              subscription_id: sub.id,
              plan_id: sub.plan_id,
              plan_code: sub.plan.code,
              plan_name: sub.plan.name,
              reading_ref: "Genesis #{chapter_num}",
              completed: current_user.completions.exists?(plan: sub.plan, on_date: today)
            }
          end
          # Ensure valid start book
          start_idx = books.index { |b| b.name == start_book_name } || 0
          # Clamp start chapter to book range
          max_for_start = books[start_idx].chapter_count
          current_idx = start_idx
          current_chapter = [[start_chapter, 1].max, max_for_start].min

          offset = days_since_start
          while offset > 0
            current_chapter += 1
            if current_chapter > books[current_idx].chapter_count
              current_idx = (current_idx + 1) % books.length
              current_chapter = 1
            end
            offset -= 1
          end

          {
            subscription_id: sub.id,
            plan_id: sub.plan_id,
            plan_code: sub.plan.code,
            plan_name: sub.plan.name,
            reading_ref: "#{books[current_idx].name} #{current_chapter}",
            completed: current_user.completions.exists?(plan: sub.plan, on_date: today)
          }
        end
      end.compact

      render json: { assignments: assignments }
    end
  end
end
