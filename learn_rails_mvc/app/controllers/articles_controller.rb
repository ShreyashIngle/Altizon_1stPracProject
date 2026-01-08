class ArticlesController < ApplicationController
  
  skip_before_action :verify_authenticity_token

  before_action :set_article, only: %i[show edit update destroy]

  # GET /articles
  def index
    @articles = Article.all
    render json: @articles
  end

  # GET /articles/:id
  def show
    render json: @article
  end

  # GET /articles/new
  def new
    @article = Article.new
    render json: @article
  end

  # POST /articles
  def create
    @article = Article.new(article_params)
    if @article.save
      LogJsonWorker.perform_async("Article", @article.as_json) # <-- Sidekiq job
      render json: @article, status: :created
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  # GET /articles/:id/edit
  def edit
    render json: @article
  end

  # PUT /articles/:id
  def update
    if @article.update(article_params)
      LogJsonWorker.perform_async("Article", @article.as_json) # optional: enqueue on update
      render json: @article
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  # DELETE /articles/:id
  def destroy
    LogJsonWorker.perform_async("Article", @article.as_json) # optional: enqueue on delete
    @article.destroy
    head :no_content
  end

 # GET /articles/search?q=rails
  def search
    if params[:q].present?
      results = Article.search_query(params[:q])
      render json: results.records.to_a
    else
      render json: []
    end
  end

  private

  def set_article
    @article = Article.find(params[:id])
  end

  def article_params
    params.require(:article).permit(:title, :content)
  end
end
