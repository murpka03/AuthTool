<<<<<<< HEAD
class PhotosController < ApplicationController
  
  before_filter :require_existing_photo, :only => [:show, :edit, :update, :destroy]
  before_filter :require_existing_target_folder, :only => [:new, :create]
  
=======
class PhotosController < ApplicationController 
>>>>>>> 305715122f28973ce0ff144f2e716044eafea6ad
  def index
    @photos = Photo.all
  end
  
  def new
<<<<<<< HEAD
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
=======
    @photo = Photo.new(:user_id => params[:user_id])
  end
  
  def show
    @photo = Photo.find(params[:id])
  end
  
  def create
    @user = User.find(session[:user_id])
    @photo = Photo.create(params[:photo])
    @photo.user_id = @user.id
    @photo.save
    redirect_to :action => 'index'
>>>>>>> 305715122f28973ce0ff144f2e716044eafea6ad
  end
  
  def edit
    @photo = Photo.find(params[:id])
  end

  def update
    @photo = Photo.find(params[:id])
    if @photo.update_attributes(params[:photo])
<<<<<<< HEAD
      flash[:notice] = "Photo removed from library."
=======
      flash[:notice] = "Successfully updated painting."
>>>>>>> 305715122f28973ce0ff144f2e716044eafea6ad
      redirect_to @photo.library
    else
      render :action => 'edit'
    end
  end

  def destroy
<<<<<<< HEAD
    @photo = Photo.find(params[:photo_id])
    @photo.destroy
    redirect_to :controller=>:sessions, :action=>:profile,:user_id=>current_user.id
    flash[:notice] = "Photo removed from library."
  end
  
  def require_existing_photo
    @photo = Photo.find(params[:photo_id])
    
=======
    @photo = Photo.find(params[:id])
    @photo.destroy
    flash[:notice] = "Successfully destroyed painting."
    redirect_to @photo.library
>>>>>>> 305715122f28973ce0ff144f2e716044eafea6ad
  end
  
end
