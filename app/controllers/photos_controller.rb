class PhotosController < ApplicationController
  
  #before_filter :require_existing_photo, :only => [:show, :edit, :update, :destroy]
  #before_filter :require_existing_target_folder, :only => [:new, :create]
  
  def index
    @photos = Photo.all
  end
  
  def new
    @photo = Photo.new(:folder_id=> params[:folder_id])
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
  
  
  def show
    @photo = Photo.find(params[:id])
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
  
  def create
    @photo = Photo.create(params[:photo])
    @photo.save!
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
  
  def edit
    @photo = Photo.find(params[:id])
  end

  def update
    @photo = Photo.find(params[:id])
    respond_to do |format|
      if @@profile
        format.html {render 'sessions/profile'}
      end
      if @@tour_bool
        format.html {redirect_to :controller=>:tours, :action=>:show,:tour_id=>@@current_tour}
      end
    end
  end

  def destroy
    @photo = Photo.find(params[:id])
    @photo.destroy
    respond_to do |format|
      if @@profile
        format.html {render 'sessions/profile'}
      end
      if @@tour_bool
        format.html {redirect_to :controller=>:tours, :action=>:show,:tour_id=>@@current_tour}
      end
    end
  end
  
  def require_existing_photo
    @photo = Photo.find(params[:photo_id])
    
  end
  
end
