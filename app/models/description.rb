class Description < ActiveRecord::Base
  attr_accessible :source_id, :tour_id, :site_id, :text
  validates_presence_of :text
  belongs_to :site, :class_name=>'Site'
  belongs_to :source, :class_name=>'Source'
  belongs_to :tour, :class_name=>'Tour'
end
