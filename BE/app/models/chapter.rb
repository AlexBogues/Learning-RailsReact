class Chapter < ApplicationRecord
  belongs_to :book

  validates :number, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :book_id, presence: true
  validates :number, uniqueness: { scope: :book_id }
end


