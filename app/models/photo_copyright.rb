class PhotoCopyright < ActiveRecord::Base
  attr_accessible :color, :left_offset, :notice, 
    :opacity, :photo_id, :top_offset, :size

  belongs_to :photo
  VALID_COPY_COLOR = /\A[0-9a-f]{6}\z/i

  validates :color, format:{with:VALID_COPY_COLOR}

  def self.create_default(copy_notice)
    if PhotoCopyright.first.nil?
      PhotoCopyright.create!(
        notice:copy_notice,
        opacity:1.0,
        size:0.2,
        color:"FF0000",
        top_offset:0.94,
        left_offset:0.7
      )
    end
  end
end
