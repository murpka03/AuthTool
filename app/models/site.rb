class Site < ActiveRecord::Base

  attr_accessible :latitude, :longitude, :tour_id, :photos, :sources
  has_many :photos
  has_many :sources
  validates_presence_of :tour
  belongs_to :tour

  #acts_as_gmappable

  #def gmaps4rails_address
  #  address
  #end

  def gmaps4rails_infowindow
    "<h1>#{name}</h1><br>Latitude: #{latitude} Longitude: #{longitude}"
  end

  def gmaps4rails_marker_picture
    {
      "picture" => "/images/pin_icon.png",          # string,  mandatory
      "width" =>  "35",          # integer, mandatory
      "height" => "37",          # integer, mandatory
    }
  end


end