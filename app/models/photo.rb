class Photo < ActiveRecord::Base
  attr_accessible :image, :name, :user_id, :remote_image_url
  validates_presence_of :user_id
  belongs_to :user
  mount_uploader :image, PhotoUploader
  
  before_create :default_name
  

  def default_name
    self.name ||= File.basename(image.filename, '.*').titleize if image
  end
  
end
