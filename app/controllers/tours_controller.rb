class ToursController < ApplicationController

 
   # Note: @target_folder is set in require_existing_target_folder
  def new
    @tour = Tour.new(params[:id])
    respond_to do |format|
      format.html
      format.js
    end
  end
  # Note: @target_folder is set in require_existing_target_folder
  def create
     @tour = Tour.create(params[:tour])
     @tour.save!
     respond_to do |format|
      format.html {render 'sessions/profile'}
      format.js
     end
    #  
    #if @foldesr.save
    #  redirect_to(:controller=>:sessions, :action=>:profile, :user_id=>current_user.id)
    #else
    #  render :action => 'new'
    #end
  end
  def show
    #@tour = current_user.tours.first
    @tour = current_user.tours.find(params[:tour_id])
    @sites = @tour.sites.to_json
  end
  

end