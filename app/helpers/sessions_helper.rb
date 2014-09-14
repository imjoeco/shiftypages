module SessionsHelper
	def sign_in(user)
    user.update_attributes(
      :remember_token => SecureRandom.urlsafe_base64
    )
		cookies.permanent[:remember_token] = user.remember_token
		current_user = user
	end

	def current_user=(user)
		current_user = user
	end

	def flickr_user_id
		"YOUR_USER_ID"
	end

	def current_user
    unless cookies[:remember_token].nil?
      current_user ||= User.find_by_remember_token(cookies[:remember_token])
    end
	end

	def settings
		settings ||= UserSetting.first
	end

  def user_name
    user_name ||= User.first.name
  end

	def signed_in?
		!current_user.nil?
	end

	def sign_out
    current_user.update_attributes(:remember_token => nil)
		cookies.delete(:remember_token)
		current_user = nil
	end

	def signed_in_user
		redirect_to root_path	unless signed_in?
	end
end
