class FoldersController < ApplicationController
  
  def index
    @folders = []
    
    Folder.all.each do |f|
      id = f.id
      name = f.name
      folder = {:id=>id,:name=>name}
      @folders.append(folder);
    end
    @folders = @folders.to_json
  end

  # Note: @folder is set in require_existing_folder
  def show
    @folder = Folder.find(params[:folder_id])
     respond_to do |format|
      format.html
     end
     #redirect_to :controller=>:library, :action=>:show
  end

  # Note: @target_folder is set in require_existing_target_folder
  def new
    @folder = Folder.new(:parent_id=>params[:parent_id])
    respond_to do |format|
      format.html {render 'sessions/profile'}
      format.js
    end
  end
  # Note: @target_folder is set in require_existing_target_folder
  def create
     @folder = Folder.create(params[:folder])
     @folder.user_id = current_user.id
     @folder.save!
     respond_to do |format|
      format.js
      format.html {render 'sessions/profile'}
     end
    #  
    #if @foldesr.save
    #  redirect_to(:controller=>:sessions, :action=>:profile, :user_id=>current_user.id)
    #else
    #  render :action => 'new'
    #end
  end
  
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

  def is_root?
    parent.nil? && !new_record?
  end
  
  def has_children?
    children.count > 0
  end

  # Note: @folder is set in require_existing_folder
  def self.root
    @root_folder ||= find_by_name_and_parent_id('Root folder', nil)
  end

  # Note: @folder is set in require_existing_folder
  def update
    if @folder.update_attributes(params[:folder])
      redirect_to edit_folder_url(@folder), :notice => t(:your_changes_were_saved)
    else
      render :action => 'edit'
    end
  end

  # Note: @folder is set in require_existing_folder
  def destroy
    @folder = Folder.find(params[:folder_id])
    id = @folder.user_id
    @folder.destroy
    redirect_to :controller=>:sessions,:action=>:profile,:user_id=>id
  end

  
end
