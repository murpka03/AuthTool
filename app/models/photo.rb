class Photo < ActiveRecord::Base
<<<<<<< HEAD
  attr_accessible :image, :name, :folder_id, :remote_image_url
  validates_presence_of :folder_id
  belongs_to :folder
=======
  attr_accessible :image, :name, :user_id, :remote_image_url
  validates_presence_of :user_id
  belongs_to :user
>>>>>>> 305715122f28973ce0ff144f2e716044eafea6ad
  mount_uploader :image, PhotoUploader
  
  before_create :default_name
  

  def default_name
    self.name ||= File.basename(image.filename, '.*').titleize if image
  end
  
end
