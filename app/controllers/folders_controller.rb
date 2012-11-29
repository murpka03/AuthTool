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
    @folder = Folder.find(params[:id])
     respond_to do |format|
       format.js
      if @@profile
        format.html {render 'sessions/profile'}
      end
      if @@tour_bool
        format.html {redirect_to :controller=>:tours, :action=>:show,:tour_id=>@@current_tour}
      end
    end
     #redirect_to :controller=>:library, :action=>:show
  end

  # Note: @target_folder is set in require_existing_target_folder
  def new
    @folder = Folder.new(:parent_id=>params[:parent_id],:user_id=>params[:user_id])
    respond_to do |format|
      format.js
      if @@profile
        format.html {render 'sessions/profile'}
      end
      if @@tour_bool
        format.html {redirect_to :controller=>:tours, :action=>:show,:tour_id=>@@current_tour}
      end
      
    end
  end
  # Note: @target_folder is set in require_existing_target_folder
  def create
     @folder = Folder.create(params[:folder])
     @folder.user_id = current_user.id
     @folder.save!
     respond_to do |format|
      format.js
      if @@profile
        format.html {render :template=>'sessions/profile', :locals=>{:user_id => @folder.user_id}}
      end
      if @@tour_bool
        format.html {redirect_to :controller=>:tours, :action=>:show,:tour_id=>@@current_tour}
      end
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
    @folder = Folder.find(params[:id])
    id = @folder.user_id
    @folder.destroy
    respond_to do |format|
      format.js
      if @@profile
        format.html {render 'sessions/profile'}
      end
      if @@tour_bool
        format.html {redirect_to :controller=>:tours, :action=>:show,:tour_id=>@@current_tour}
      end
    end
  end

  
end
