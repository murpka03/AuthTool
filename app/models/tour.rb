class Tour < ActiveRecord::Base

  attr_accessible :user_id, :name, :sites
  belongs_to :user
  has_many :sites


end