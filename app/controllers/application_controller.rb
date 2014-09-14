class ApplicationController < ActionController::Base
  protect_from_forgery
  include SessionsHelper

  around_filter :user_time_zone, if: :current_user
  before_filter :set_variables

  def user_time_zone(&block)
    if !UserSetting.first.nil?
      Time.use_zone(UserSetting.first.time_zone, &block)

    #catch before time_zone set
    else
      Time.use_zone("Central Time (US & Canada)", &block)
    end
  end

  def set_variables
    @categories = PostType.where("parent_type_id IS null AND hidden_type = 'f'")
  end
end
