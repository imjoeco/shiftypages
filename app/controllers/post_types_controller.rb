class PostTypesController < ApplicationController
  before_filter :signed_in_user
  def new
    @post_type = PostType.new
    @post_types = PostType.all.drop(1)
  end

  def create
    @post_type = PostType.new(params[:post_type])
    if @post_type.save
      redirect_to post_types_path
    else
      @post_types = PostType.all.drop(1)
      render 'new'
    end
  end

  def edit
    @post_type = PostType.find(params[:id])
    @post_types = PostType.all
  end

  def update
    @post_type = PostType.find(params[:id])
    if @post_type.update_attributes(params[:post_type])
      redirect_to post_types_path
    else
      @post_types = PostType.all.drop(1)
      render 'new'
    end
  end
  
  def show
    redirect_to posts_path(post_type:params[:id])
  end

  def index
    @post_types = PostType.where("parent_type_id IS ?", nil).drop(1)
  end

  def destroy
    if params[:id] != 1
      @post_type = PostType.find(params[:id])
      @post_type.destroy
    else
      flash[:error] = "Sorry, but you cannot delete first post type."
    end
    redirect_to post_types_path
  end
end
