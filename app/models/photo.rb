class Photo < ActiveRecord::Base
  attr_accessible :description, :farm, :flickr_id, 
    :post_id, :secret, :server, :title,:image, 
    :image_file_size, :ow, :oh

  has_attached_file :image
  belongs_to :post
  has_one :photo_copyright

  def flickrify
    require 'flickraw'      
    user = User.first

    FlickRaw.api_key = user.flickr_api_key
    FlickRaw.shared_secret = user.flickr_shared_secret

    flickr.access_token = user.flickr_access_token
    flickr.access_secret = user.flickr_access_secret

    user_id = user.flickr_user_id

    if self.farm.nil?
      photo = flickr.photos.search(:user_id => user_id, :text => "shifty_photo_#{self.id}")[0]
      if !photo.nil?
        self.update_attributes(
          :server => photo.server.to_i,
          :secret => photo.secret,
          :farm => photo.farm.to_i,
          :flickr_id => photo.id,
          :image_file_size => nil
        )
        self.image.destroy
        self.photo_copyright.destroy
      end
    end
  end

  def url_t
    "https://farm#{self.farm}.staticflickr.com/#{self.server}/#{self.flickr_id}_#{self.secret}_t.jpg"
  end

  def url_m
    "https://farm#{self.farm}.staticflickr.com/#{self.server}/#{self.flickr_id}_#{self.secret}_m.jpg"
  end

  def url_b
    if self.farm.nil?
      self.image.url
    else
      "https://farm#{self.farm}.staticflickr.com/#{self.server}/#{self.flickr_id}_#{self.secret}_b.jpg"
    end
  end

  def next
    Photo.where("post_id = ? AND id > ?", self.post_id, self.id).first
  end

  def prev
    Photo.where("post_id = ? AND id < ?", self.post_id, self.id).last
  end
end
