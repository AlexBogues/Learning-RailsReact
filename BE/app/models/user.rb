class User < ApplicationRecord
  has_many :subscriptions, dependent: :destroy
  has_many :plans, through: :subscriptions
  has_many :completions, dependent: :destroy

  validates :supabase_user_id, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :timezone, presence: true
end
