class PostsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_post, only: %i[show edit update destroy]

  def index
    render json: Post.all
  end

  def show
    render json: @post
  end

  def create
    @post = Post.new(post_params)
    if @post.save
      LogJsonWorker.perform_async("Post", @post.as_json)
      render json: @post, status: :created
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  def update
    if @post.update(post_params)
      LogJsonWorker.perform_async("Post", @post.as_json)
      render json: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  def destroy
    LogJsonWorker.perform_async("Post", @post.as_json)
    @post.destroy
    head :no_content
  end

  # GET /posts/search?q=rails
  def search
    if params[:q].present?
      results = Post.search_query(params[:q])
      render json: results.records.to_a
    else
      render json: []
    end
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def post_params
    params.require(:post).permit(:title, :body)
  end
end
