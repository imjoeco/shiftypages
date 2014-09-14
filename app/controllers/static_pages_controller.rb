class StaticPagesController < ApplicationController
  before_filter :first_user_exists

  def home
    @post = Post.first
    #@posts = Post.order("created_at DESC").page(params[:page]).per_page(2) 
  end

  private
    def first_user_exists
      if User.first.nil?
        redirect_to signup_path
      end
    end
end
