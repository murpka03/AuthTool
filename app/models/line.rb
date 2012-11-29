class Line < ActiveRecord::Base
  attr_accessible :slat, :slng, :elat, :elng, :tour_id
  validates_presence_of :tour_id
  belongs_to :tour
  
 
  
end
