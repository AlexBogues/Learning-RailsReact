module Api
  class BooksController < ApplicationController
    def index
      books = Book.select(:id, :name, :testament, :position, :chapter_count).order(:position)
      render json: books
    end
  end
end



