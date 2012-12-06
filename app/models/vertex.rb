class Vertex < ActiveRecord::Base
  attr_accessible :latitude, :longitude, :tour_id
  belongs_to :tour
  
end
