class Photo < ActiveRecord::Base
  attr_accessible :image, :name, :folder_id, :remote_image_url
  validates_presence_of :folder_id
  belongs_to :folder
  mount_uploader :image, PhotoUploader
  
  before_create :default_name
  

  def default_name
    self.name ||= File.basename(image.filename, '.*').titleize if image
  end
  
end
