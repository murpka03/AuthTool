class Vertex < ActiveRecord::Base
  attr_accessible :latitude, :longitude, :tour_id
  validates_presence_of :tour_id
  belongs_to :tour
  
end
