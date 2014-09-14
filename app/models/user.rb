class User < ActiveRecord::Base
  attr_accessible :email, :name, :password, 
    :password_confirmation, :remember_token, 
    :flickr_api_key, :flickr_shared_secret, 
    :flickr_access_token, :flickr_access_secret, 
    :flickr_auth_url, :flickr_oauth_token, 
    :flickr_oauth_token_secret

  has_secure_password

  validates_presence_of :email, :name, :flickr_api_key, :flickr_shared_secret

  def validate_flickr_url
    require 'flickraw'

    FlickRaw.api_key= self.flickr_api_key
    FlickRaw.shared_secret= self.flickr_shared_secret

    token = flickr.get_request_token 
    url = flickr.get_authorize_url(
      token['oauth_token'], 
      :perms => 'write'
    ) 

    # Credentials for update_flickr_credentials
    self.flickr_auth_url = url
    self.flickr_oauth_token = token['oauth_token']
    self.flickr_oauth_token_secret = token['oauth_token_secret']
    self.save

    return url
  end

  # if false encrypt access_token and access_secret or find workaround
  def update_flickr_credentials(verify_token)
    require 'flickraw'

    FlickRaw.api_key= self.flickr_api_key
    FlickRaw.shared_secret= self.flickr_shared_secret

    flickr.get_access_token(self.flickr_oauth_token, self.flickr_oauth_token_secret, verify_token.strip)

    if login = flickr.test.login
      self.flickr_user_id = login.id
      self.flickr_access_token = flickr.access_token
      self.flickr_access_secret = flickr.access_secret

      self.flickr_oauth_token = nil
      self.flickr_oauth_token_secret = nil
      self.flickr_auth_url = nil

      self.save
    end
  end

  def backup
    require 'csv'

    CSV.generate do |csv|
      PostType.all.each do |post_type|
        csv << [
          post_type.id,
          post_type.name,
          post_type.description,
          post_type.parent_type_id,
          post_type.shifty_type,
          post_type.hidden_type
        ]
      end

      csv << []

      Post.all.each do |post|
        csv << [
          post.id,
          post.title,
          post.content,
          post.post_type_id,
          post.published_at
        ]
      end

      csv << []

      Photo.all.each do |photo|
        csv << [
          photo.id,
          photo.title,
          photo.description,
          photo.post_id,
          photo.server,
          photo.secret,
          photo.farm,
          photo.flickr_id,
          photo.ow,
          photo.oh,
          photo.image_file_size
        ]
      end

      csv << []

      photo_copyright = PhotoCopyright.first
      csv << [
        photo_copyright.notice,
        photo_copyright.opacity,
        photo_copyright.size,
        photo_copyright.color,
        photo_copyright.top_offset,
        photo_copyright.left_offset
      ]

      csv << []

      user_setting = UserSetting.first
      csv << [
        user_setting.title,
        user_setting.slogan,
        user_setting.copy_notice,
        user_setting.time_zone,
        user_setting.font_link,
        user_setting.font_style
      ]
    end
  end

  def restore_from(backup_file)
    require 'csv'
    model_type = 0

    tables = ["post_types","posts","photos","photo_copyrights"]

    #clear the tables
    tables.each do |table|
      if Rails.env.production?
        ActiveRecord::Base.connection.execute("TRUNCATE #{table}")
      else
        ActiveRecord::Base.connection.execute("DELETE from #{table}")
        ActiveRecord::Base.connection.execute("DELETE from sqlite_sequence where name = '#{table}'")
      end
    end

    CSV.foreach(backup_file.path, headers:false) do |row|
      if row.empty?
        model_type = model_type + 1
      else
        create_with_filler(row,model_type)
      end
    end

    #clean up filler records
    Photo.where("title = ?","blankshifty").destroy_all
    Post.where("title = ?","blankshifty").destroy_all
    PostType.where("name = ?","blankshifty").destroy_all
  end

  private
    def create_with_filler(row, model_type)
      record_id = row[0].to_i

      case model_type
      when 0
        post_type_create(record_id, row)
      when 1
        post_create(record_id, row)
      when 2
        photo_create(record_id, row)
      when 3
        PhotoCopyright.create!(
          notice:row[0],
          opacity:row[1],
          size:row[2],
          color:row[3],
          top_offset:row[4],
          left_offset:row[5]
        )
      when 4
        UserSetting.first.update_attributes(
          title:row[0],
          slogan:row[1],
          copy_notice:row[2],
          time_zone:row[3],
          font_link:row[4],
          font_style:row[5]
        )
      end
    end

    def post_type_create(record_id, row)
      #recursive call to fill in gaps
      if record_id > 1 && PostType.where("id = ?",record_id - 1).empty?
        post_type_create(record_id - 1,[])
      end

      #create record if row present, otherwise make and delete filler record
      if !row.empty?
        PostType.create!(
          name:row[1],
          description:row[2],
          parent_type_id:row[3],
          shifty_type:row[4],
          hidden_type:row[5]
        )
      else
        post_type = PostType.create!(name:"blankshifty")
      end
    end

    def post_create(record_id, row)
      #recursive call to fill in gaps
      if record_id > 1 && Post.where("id = ?",record_id - 1).empty?
        post_create(record_id - 1,[])
      end

      #create record if row present, otherwise make and delete filler record
      if !row.empty?
        Post.create!(
          title:row[1],
          content:row[2],
          post_type_id:row[3],
          published_at:row[4],
          user_id:1
        )
      else
        post = Post.create!(title:"blankshifty")
      end
    end

    def photo_create(record_id, row)
      #recursive call to fill in gaps
      if record_id > 1 && Photo.where("id = ?",record_id - 1).empty?
        photo_create(record_id - 1,[])
      end

      #create record if row present, otherwise make filler record
      if !row.empty?
        Photo.create!(
          title:row[1],
          description:row[2],
          post_id:row[3],
          server:row[4],
          secret:row[5],
          farm:row[6],
          flickr_id:row[7],
          ow:row[8],
          oh:row[9],
          image_file_size:row[10]
        )
      else
        Photo.create!(title:"blankshifty")
      end
    end
end
