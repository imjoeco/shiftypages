class PostsController < ApplicationController
	before_filter :signed_in_user, :except => [:show, :index]

  def new
    if params[:post_type].present?
      @post = Post.new
      @post_type = PostType.find(params[:post_type])
    else
      redirect_to select_post_type_posts_path
    end
  end

  def select_post_type
    @post_types = PostType.where("parent_type_id IS ?", nil).drop(1)
  end

  def create
    @post = Post.new(params[:post])
    post_type = PostType.find(params[:post][:post_type_id])
    if @post.save
      if post_type.shifty_type
        redirect_to post_type
      else
        redirect_to @post
      end
    else
      render 'new'
    end
  end

  def edit
    @post = Post.find(params[:id])
    @post_type = PostType.find(@post.post_type_id)
  end

  def update
    @post = Post.find(params[:id])
    if @post.update_attributes(params[:post])
      redirect_to @post
    else
      render 'edit'
    end
  end

  def show
    @post = Post.where("id = ?",params[:id]).limit(1)[0]
    if @post && !@post.published_at.nil? || @post && signed_in?
      @post_type = PostType.find(@post.post_type_id)
      @prev_page = @post.prev
      @next_page = @post.next
    else
      flash[:error] = "Sorry, but that post could not be found."
      redirect_to root_path
    end
  end

  def index
    #check for post_type name param.
    if params[:id].present? || params[:post_type].present?
      if params[:id].present?
        @post_type = PostType.where("name LIKE ?", params[:id]).limit(1)[0]

      #params[:post_type] is from PostType show action redirect
      else
        @post_type = PostType.find(params[:post_type])
      end

      #only render index for public with post_type
      if @post_type
        #only render published posts for public
        if signed_in?
          @posts = @post_type.posts
        else
          @posts = @post_type.published_posts
        end

        #check if there are sub-post_types to index
        if @post_type.has_children?
          @child_types = PostType.where("parent_type_id = ?", @post_type.id)
        end

        #if there's only one post and no sub-post_types, just render the post
        if @posts.length == 1 && @child_types.nil?
          @post = @posts[0]
          @photos = @post.photos
          render 'posts/show'
        end

      #catch if post_type can't be found
      else
        flash[:error] = "Sorry but the page you're looking for can't be found."
        redirect_to root_path
      end

    #if no post_type param exists, render full post list only for signed in users
    elsif signed_in?
      @posts = Post.order("created_at DESC")

    #catch if no post found and not signed in
    else
      flash[:error] = "Sorry but the page you're looking for can't be found."
      redirect_to root_path
    end
  end

  def publish
    @post = Post.where("id = ?",params[:id]).limit(1)[0]
    if @post
      if @post.publish
        flash[:success] = "Successfully published."
      else
        flash[:error] = "Publish action unsuccessful."
      end
      redirect_to @post
    end
  end

  def unpublish
    @post = Post.where("id = ?",params[:id]).limit(1)[0]
    if @post
      if @post.unpublish
        flash[:success] = "Successfully unpublished."
      else
        flash[:error] = "Unpublish action unsuccessful."
      end
      redirect_to @post
    end
  end

  def destroy
    post = Post.find(params[:id])
    if post
      post.destroy
    end
    redirect_to root_path
  end
end
