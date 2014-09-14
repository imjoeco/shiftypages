class UsersController < ApplicationController
  before_filter :signed_in

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      sign_in(@user)
      redirect_to @user
    else
      render 'new'
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update_attributes(params[:user])
      redirect_to root_path
    else
      render 'edit'
    end
  end

  def password_reset
    if params[:current_password]
      if current_user.authenticate(params[:current_password])
        current_user.update_attributes(password:params[:password], password_confirmation:params[:password_confirmation])
        if current_user.authenticate(params[:password])
          flash[:success] = "Password Successfully Changed"
          redirect_to edit_user_path(current_user)
        else
          flash[:error] = "The new password was not accepted. The new password must be at least 6 characters long and the password confimation must match."
        end
      else
        flash[:error] = "Invalid current password. Please try again."
      end
    end
  end

  def backup
    file_name = Time.zone.now.strftime("%Y-%m-%d") + "-shiftypages-backup.csv"
    if params[:password]
      if current_user.authenticate(params[:password])
        send_data current_user.backup, :filename => file_name
      else
        flash[:error] = "Incorrect password. Please try again."
      end
    end
  end

  def restore
    if request.put? || request.post?
      if current_user.authenticate(params[:password])
        if params[:backup_file] && params[:backup_file].content_type == "text/csv"
          current_user.restore_from(params[:backup_file])
          redirect_to root_path
        else
          flash[:error] = "Something appears to have gone wrong, please check to make sure that the file is a backup.csv file downloaded from this site."
        end
      else
        flash[:error] = "Incorrect password. Please try again."
      end
    end
  end

  private
    #filters for limiting users to 1 and finalizing settings
    def signed_in
      unless signed_in? || User.first.nil?
        redirect_to root_path
        return
      end
      if signed_in? && settings.nil?
        redirect_to new_user_setting_path
      end
    end
end
