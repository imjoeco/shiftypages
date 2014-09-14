class PhotosController < ApplicationController
  before_filter :signed_in_user, only:[:new, :create, :edit, :update]

  def new
    @post = Post.find(params[:post_id])
    @photo = @post.photos.new
    @photo_copyright = @photo.build_photo_copyright
    @default_copy = PhotoCopyright.first
  end

  def create
    @photo = Photo.new(params[:photo])
    if @photo.save
      params[:photo_copyright]["photo_id"] = @photo.id
      PhotoCopyright.create!(params[:photo_copyright])
      PhotosWorker.perform_async(@photo.id, copy_temp_photo_url(@photo.id))

      redirect_to post_path(@photo.post_id)
    else
      render 'new'
    end
  end 

  def copy_temp
    @photo = Photo.find(params[:id])
    @photo_copyright = @photo.photo_copyright
    render :layout => false
  end

  def edit
    @photo = Photo.find(params[:id])
    @photo_copyright = @photo.photo_copyright
  end

  def update
    @photo = Photo.find(params[:id])
    if @photo.update_attributes(params[:photo])
      redirect_to @photo
    else
      render 'edit'
    end
  end

  def show
    @photo = Photo.find(params[:id])
    @post = Post.find(@photo.post_id)
    @prev_page = @photo.prev
    @next_page = @photo.next
  end

  def index
    @post = Post.find(params[:post_id])
    @photos = @post.photos
  end

  def destroy
    photo = Photo.find(params[:id])
    post = Post.find(photo.post_id)
    photo.destroy
    redirect_to post
  end
end
