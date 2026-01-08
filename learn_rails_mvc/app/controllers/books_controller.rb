class BooksController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_book, only: %i[show edit update destroy]

  def index
    render json: Book.all
  end

  def show
    render json: @book
  end

  def create
    @book = Book.new(book_params)
    if @book.save
      LogJsonWorker.perform_async("Book", @book.as_json)
      render json: @book, status: :created
    else
      render json: @book.errors, status: :unprocessable_entity
    end
  end

  def update
    if @book.update(book_params)
      LogJsonWorker.perform_async("Book", @book.as_json)
      render json: @book
    else
      render json: @book.errors, status: :unprocessable_entity
    end
  end

  def destroy
    LogJsonWorker.perform_async("Book", @book.as_json)
    @book.destroy
    head :no_content
  end

  # GET /books/search?q=some_term
  def search
    if params[:q].present?
      results = Book.search_query(params[:q])
      render json: results.records.to_a
    else
      render json: []
    end
  end

  private

  def set_book
    @book = Book.find(params[:id])
  end

  def book_params
    params.require(:book).permit(:title, :author, :description)
  end
end
