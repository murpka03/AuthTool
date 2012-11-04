class PhotosController < ApplicationController
  
  before_filter :require_existing_photo, :only => [:show, :edit, :update, :destroy]
  before_filter :require_existing_target_folder, :only => [:new, :create]
  
  def index
    @photos = Photo.all
  end
  
  def new
    @photo = Photo.new(:folder_id=> params[:folder_id])
  end

  def show
    @photo = Photo.find(params[:id])
  end
  
  def create
    @photo = Photo.create(params[:photo])
    redirect_to :controller=>:library, :action=>:show, :user_id=> params[:user_id]
  end
  
  def edit
    @photo = Photo.find(params[:id])
  end

  def update
    @photo = Photo.find(params[:id])
    if @photo.update_attributes(params[:photo])
      flash[:notice] = "Successfully updated painting."
      redirect_to @photo.library
    else
      render :action => 'edit'
    end
  end

  def destroy
    @photo = Photo.find(params[:id])
    @photo.destroy
    redirect_to :controller=>:library, :action=>:show,:user_id=>current_user.id
    flash[:notice] = "Successfully destroyed painting."
  end
  
  def require_existing_photo
    @photo = Photo.find(params[:id])
    @folder = @photo.folder
  rescue ActiveRecord::RecordNotFound
    redirect_to Folder.root, :alert => t(:already_deleted, :type => t(:this_file))
  end
  
end
