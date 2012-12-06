class Hotspot < ActiveRecord::Base
  attr_accessible :latitude, :longitude, :text, :tour_id
  belongs_to :tour
  
  
end
