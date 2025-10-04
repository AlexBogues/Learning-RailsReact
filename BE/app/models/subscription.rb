class Subscription < ApplicationRecord
  belongs_to :user
  belongs_to :plan

  scope :active, -> { where(active: true) }

  validates :start_date, presence: true
end
