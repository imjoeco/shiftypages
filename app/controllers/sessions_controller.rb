class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by_email(params[:session][:name])
    if !user.nil?
      authenticated = user.authenticate(params[:session][:password])
    end

    if authenticated
      sign_in user
      redirect_to root_path
    else
      flash[:error] = "Wrong name/password. Try again"
      render 'new'
    end
  end

  def destroy
    sign_out
    redirect_to root_path
  end
end
