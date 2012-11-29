class Tour < ActiveRecord::Base
  attr_accessible :user_id, :name, :sites, :hotspots, :lines, :vertices, :source, :description
  belongs_to :user
  has_many :sites
  has_many :hotspots
  has_many :lines
  has_many :vertices
  has_one :source, :foreign_key=> :tour_id
  has_one :description, :foreign_key=> :tour_id


end