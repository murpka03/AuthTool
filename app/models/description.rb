class Description < ActiveRecord::Base
  attr_accessible :source_id, :name
  belongs_to :source
end
