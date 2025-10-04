class Book < ApplicationRecord
  has_many :chapters, dependent: :destroy

  TESTAMENTS = ["Old Testament", "New Testament"].freeze

  validates :name, presence: true, uniqueness: true
  validates :testament, presence: true, inclusion: { in: TESTAMENTS }
  validates :position, presence: true, numericality: { only_integer: true, greater_than: 0 }, uniqueness: true
  validates :chapter_count, presence: true, numericality: { only_integer: true, greater_than: 0 }
end


