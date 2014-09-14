# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20140405031506) do

  create_table "photo_copyrights", :force => true do |t|
    t.string   "notice"
    t.float    "opacity"
    t.float    "size"
    t.string   "color"
    t.float    "top_offset"
    t.float    "left_offset"
    t.integer  "photo_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "photo_copyrights", ["photo_id"], :name => "index_photo_copyrights_on_photo_id"

  create_table "photos", :force => true do |t|
    t.integer  "photo_type_id"
    t.integer  "post_id"
    t.string   "title"
    t.string   "description"
    t.string   "secret"
    t.integer  "server"
    t.integer  "farm"
    t.string   "flickr_id"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.integer  "oh"
    t.integer  "ow"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  add_index "photos", ["photo_type_id"], :name => "index_photos_on_photo_type_id"
  add_index "photos", ["post_id"], :name => "index_photos_on_post_id"

  create_table "post_types", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.integer  "parent_type_id"
    t.boolean  "shifty_type"
    t.boolean  "hidden_type"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  add_index "post_types", ["parent_type_id"], :name => "index_post_types_on_parent_type_id"

  create_table "posts", :force => true do |t|
    t.string   "title"
    t.text     "content"
    t.integer  "user_id"
    t.integer  "post_type_id"
    t.datetime "published_at"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "posts", ["post_type_id"], :name => "index_posts_on_post_type_id"
  add_index "posts", ["user_id"], :name => "index_posts_on_user_id"

  create_table "user_settings", :force => true do |t|
    t.integer  "user_id"
    t.string   "title"
    t.string   "slogan"
    t.string   "copy_notice"
    t.string   "time_zone"
    t.string   "font_link"
    t.string   "font_style"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "user_settings", ["user_id"], :name => "index_user_settings_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "password_digest"
    t.string   "remember_token"
    t.string   "flickr_api_key"
    t.string   "flickr_shared_secret"
    t.string   "flickr_user_id"
    t.string   "flickr_access_token"
    t.string   "flickr_access_secret"
    t.string   "flickr_auth_url"
    t.string   "flickr_oauth_token"
    t.string   "flickr_oauth_token_secret"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
  end

end
