class PhotosController < ApplicationController
  
  before_filter :require_existing_photo, :only => [:show, :edit, :update, :destroy]
  before_filter :require_existing_target_folder, :only => [:new, :create]
  
  def index
    @photos = Photo.all
  end
  
  def new
    @photo = Photo.new(:folder_id=> params[:folder_id])
    respond_to do |format|
      format.html {render 'sessions/profile'}
      format.js
    end
  end
  
  
  def show
    @photo = Photo.find(params[:id])
    respond_to do |format|
      format.js
     end
  end
  
  def create
    @photo = Photo.create(params[:photo])
    respond_to do |format|
      format.js
      format.html {render 'sessions/profile'}
    end
  end
  
  def edit
    @photo = Photo.find(params[:id])
  end

  def update
    @photo = Photo.find(params[:id])
    if params[:site_id]
      @photo.site_id = params[:site_id]
      @photo.save!
    end
  end

  def destroy
    @photo = Photo.find(params[:photo_id])
    @photo.destroy
    redirect_to :controller=>:sessions, :action=>:profile,:user_id=>current_user.id
    flash[:notice] = "Photo removed from library."
  end
  
  def require_existing_photo
    @photo = Photo.find(params[:photo_id])
    
  end
  
end
