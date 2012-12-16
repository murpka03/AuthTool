class Folder < ActiveRecord::Base
  attr_accessible :user_id, :name, :photos, :parent_id
  attr_accessible :childs
  belongs_to :user
  has_many :photos
  belongs_to :parent, :class_name => 'Folder'
  has_many :childs, :class_name => 'Folder', :foreign_key => 'parent_id'
  

  
  def parent_of?(folder)
    self.children.each do |child|
      if child == folder
        return true
      else
        return child.parent_of?(folder)
      end
    end
    false
  end
  
end
