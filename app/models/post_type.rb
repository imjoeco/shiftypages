class PostType < ActiveRecord::Base
  attr_accessible :name, :parent_type_id, :description, :shifty_type, :hidden_type

  has_many :posts

  validates_presence_of :name

  def has_children?
    !PostType.find_by_parent_type_id(self.id).nil?
  end

  def published_posts
    posts = Post.where("post_type_id = ?", self.id)
    #if there's only one post, return that whether published or not
    if posts.length == 1
      return posts

    #otherwise, only return published posts
    else
      return posts.where("published_at IS NOT NULL").order("created_at")
    end
  end
end
