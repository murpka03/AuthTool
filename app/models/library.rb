class Library 
  def initialize
    setup
  end

  def folders
    Folder.find_all_by_id(@folders)
  end

  def photos
    Photo.find_all_by_id(@photos)
  end
  
  def contents
    @contents
  end

  def add(item)
    @contents << item.id unless @contents.include?(item.id)
    if item.class == Folder
      @folders << item.id unless @folders.include?(item.id)
    else
      @photos << item.id unless @photos.include?(item.id)
    end
  end

  def remove(item)
    if item.class == Folder
      @folders.delete(item.id)
    else
      @photos.delete(item.id)
    end
  end

  def empty?
    (@folders.empty? || folders.empty?) && (@photos.empty? || photos.empty?)
  end

  def reset
    setup
  end

  private

  def setup
    @folders, @photos, @contents = [], [], []
  end
end