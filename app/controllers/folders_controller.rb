class FoldersController < ApplicationController
  
  def index
    respond_to do |format|
      format.js
    end
    
  end

  # Note: @folder is set in require_existing_folder
  def show
    @user = User.find(session[:user_id])
    @folder = Folder.find(params[:id])
     respond_to do |format|
       format.js
      if @@profile
        format.html {redirect_to :controller=>:sessions,:action=>:profile,:user_id=>@user.id}
      end
      if @@tour_bool
        format.html {redirect_to :controller=>:tours, :action=>:show,:tour_id=>@@current_tour}
      end
    end
     #redirect_to :controller=>:library, :action=>:show
  end

  # Note: @target_folder is set in require_existing_target_folder
  def new
    @user = User.find(session[:user_id])
    @folder = Folder.new(:name=>params[:name],:parent_id=>params[:parent_id],:user_id=>@user.id)
    respond_to do |format|
      format.js
      if @@profile
        format.html {redirect_to :controller=>:sessions,:action=>:profile,:user_id=>@user.id}
      end
      if @@tour_bool
        format.html {redirect_to :controller=>:tours, :action=>:show,:tour_id=>@@current_tour}
      end
      
    end
  end
  # Note: @target_folder is set in require_existing_target_folder
  def create
     @user = User.find(session[:user_id])
     @folder = Folder.new(params[:folder])
     @folder.user_id = @user.id
     @folder.save!
     respond_to do |format|
      format.js
      if @@profile
        format.html {redirect_to :controller=>:sessions,:action=>:profile,:user_id=>@user.id}
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
    respond_to do |format|
      if @@profile
        format.html {redirect_to :controller=>:sessions,:action=>:profile,:user_id=>session[:user_id]}
      end
      if @@tour_bool
        format.html {redirect_to :controller=>:tours, :action=>:show,:tour_id=>@@current_tour}
      end
    end
  end

  # Note: @folder is set in require_existing_folder
  def destroy
    @user = User.find(session[:user_id])
    @folder = Folder.find(params[:id])
    id = @folder.user_id
    @folder.destroy
    respond_to do |format|
      format.js
      if @@profile
        format.html {redirect_to :controller=>:sessions,:action=>:profile,:user_id=>@user.id}
      end
      if @@tour_bool
        format.html {redirect_to :controller=>:tours, :action=>:show,:tour_id=>@@current_tour, :user_id =>@user.id}
      end
    end
  end

  
end
