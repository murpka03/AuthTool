class Source < ActiveRecord::Base
  attr_accessible :image, :name, :site_id, :description
  validates_presence_of :site_id, :image
  has_one :description
  belongs_to :site
  
  
  
end
