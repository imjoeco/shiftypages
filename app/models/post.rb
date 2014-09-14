class Post < ActiveRecord::Base
  attr_accessible :content, :post_type_id, :published_at, 
    :user_id, :title

  has_many :photos

  validates_presence_of :post_type_id
  validates_presence_of :title, :if => :not_shifty_type?

  def not_shifty_type?
    !PostType.find(self.post_type_id).shifty_type
  end

  def publish
    self.published_at = Time.zone.now
    self.save
  end

  def unpublish
    self.published_at = nil
    self.save
  end

  def next
    Post.where("post_type_id = ? AND id > ? AND published_at IS NOT NULL",self.post_type_id,self.id).first
  end

  def prev
    Post.where("post_type_id = ? AND id < ? AND published_at IS NOT NULL",self.post_type_id,self.id).last
  end

  def self.create_first_post
    if PostType.first.nil?
      if PostType.create(name:"Home")
        Post.create(title:"You're all set!", content:'<p>This is the first post on your site which will act as your home page. To edit it, click the "Edit Post" in the toolbar above.</p>', user_id:1, post_type_id:1)
      end
    end
  end
end
