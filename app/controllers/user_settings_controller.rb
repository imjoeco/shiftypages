class UserSettingsController < ApplicationController
  before_filter :signed_in_user

  def new
    if UserSetting.first.nil?
      @user_setting = UserSetting.new
    else
      redirect_to root_path
    end
  end

  def create
    @user_setting = UserSetting.new(params[:user_setting])

    flickr_updated = current_user.update_flickr_credentials(
      params[:user_setting][:flickr_token]
    )

    if flickr_updated && @user_setting.save
      Post.create_first_post
      PhotoCopyright.create_default(@user_setting.copy_notice)

      redirect_to root_path
    else
      render 'new'
    end
  end

  def edit
    @user_setting = UserSetting.first
    if @user_setting.nil?
      redirect_to new_user_setting_path
    end
  end

  def update
    @user_setting = UserSetting.first
    if @user_setting.update_attributes(params[:user_setting])
      flash[:success] = "Update successful"
      redirect_to root_path
    else
      render 'edit'
    end
  end
end
