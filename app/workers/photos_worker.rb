class PhotosWorker
  include Sidekiq::Worker

  def perform(photo_id, copy_url)
    photo = Photo.where("id = ?", photo_id).limit(1)[0]
    if photo
      kit = IMGKit.new(copy_url, width:photo.ow, height:photo.oh) 
      image = kit.to_img(:jpg)
      file = File.new("tmp/shifty_photo_#{photo_id}.jpg", "w+",
        :encoding => 'ascii-8bit')
      file.write(image)

      photo.image = file

      if photo.save
        require 'flickraw'
        user = User.first

        FlickRaw.api_key = user.flickr_api_key
        FlickRaw.shared_secret = user.flickr_shared_secret
        flickr.access_token = user.flickr_access_token
        flickr.access_secret = user.flickr_access_secret

        flickr.upload_photo(photo.image.path)
      end

      file.close
      File.delete(file.path)

      sleep 15

      #after upload, update model and destroy image
      photo.flickrify
    end
  end
end
