class Source < ActiveRecord::Base
  attr_accessible :image, :name, :site_id, :tour_id, :description
  validates_presence_of :image
  has_one :description, :class_name=>'Description'
  belongs_to :site, :class_name=>'Site'
  belongs_to :tour, :class_name=>'Tour'
  
  
  
end
