class ImportTables < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :email

      t.string :password_digest
      t.string :remember_token

      t.string :flickr_api_key
      t.string :flickr_shared_secret
      t.string :flickr_user_id
      t.string :flickr_access_token
      t.string :flickr_access_secret
      t.string :flickr_auth_url
      t.string :flickr_oauth_token
      t.string :flickr_oauth_token_secret

      t.timestamps
    end

    create_table :user_settings do |t|
      t.integer :user_id
      t.string :title
      t.string :slogan
      t.string :copy_notice
      t.string :time_zone
      t.string :font_link
      t.string :font_style

      t.timestamps
    end
    add_index :user_settings, :user_id

    create_table :post_types do |t|
      t.string :name
      t.string :description
      t.integer :parent_type_id
      t.boolean :shifty_type
      t.boolean :hidden_type

      t.timestamps
    end
    add_index :post_types, :parent_type_id

    create_table :posts do |t|
      t.string :title
      t.text :content
      t.integer :user_id
      t.integer :post_type_id
      t.datetime :published_at

      t.timestamps
    end
    add_index :posts, :user_id
    add_index :posts, :post_type_id

    create_table :photos do |t|
      t.integer :post_id
      t.string :title
      t.string :description
      t.string :secret
      t.integer :server
      t.integer :farm
      t.string :flickr_id
      t.attachment :image
      t.integer :oh
      t.integer :ow

      t.timestamps
    end
    add_index :photos, :post_id

    create_table :photo_copyrights do |t|
      t.string :notice
      t.float :opacity
      t.float :size
      t.string :color
      t.float :top_offset
      t.float :left_offset
      t.integer :photo_id

      t.timestamps
    end
    add_index :photo_copyrights, :photo_id
  end
end
