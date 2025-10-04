class Completion < ApplicationRecord
  belongs_to :user
  belongs_to :plan

  validates :on_date, presence: true
  validates :reading_ref, presence: true
  validates :completed_at, presence: true
  validates :user_id, uniqueness: { scope: [:plan_id, :on_date] }
end
