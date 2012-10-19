class PhotosController < ApplicationController 
  def index
    @photos = Photo.all
  end
  
  def new
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
    flash[:notice] = "Successfully destroyed painting."
    redirect_to @photo.library
  end
  
end
