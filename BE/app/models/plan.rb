class Plan < ApplicationRecord
  has_many :subscriptions, dependent: :destroy
  has_many :users, through: :subscriptions
  has_many :completions, dependent: :destroy

  VALID_CODES = %w[proverb_of_day daily_chapter].freeze

  validates :code, presence: true, uniqueness: true, inclusion: { in: VALID_CODES }
  validates :name, presence: true
  validates :description, presence: true
end
