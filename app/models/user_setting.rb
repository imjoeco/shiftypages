class UserSetting < ActiveRecord::Base
  attr_accessor :flickr_token
  attr_accessible :slogan, :title, :user_id, :copy_notice, 
    :flickr_token, :time_zone, :font_style, :font_link

  before_save :clean_font

  validates_presence_of :title
  validates_inclusion_of :time_zone, in: ActiveSupport::TimeZone.zones_map(&:name)
  
  def valid_font_link?
      self.font_link =~ /\A<link href='[a-z0-9:\/.?=#&%+]+' rel='stylesheet' type='text\/css'>\z/i
  end

  def valid_font_style?
      self.font_style =~ /\Afont-family:[a-z0-9'," ]+;\z/i
  end

  private
    def clean_font
      unless self.valid_font_link?
        self.font_link = nil
      end
      unless self.valid_font_style?
        self.font_style = nil
      end

      #force important on font-family style
      unless self.font_style.nil?
        unless self.font_style.include?("!important")
          self.font_style = self.font_style.gsub(";"," !important;")
        end
      end
    end
end
