class HotspotsController < ApplicationController
  
  def index
    @hotspots = Hotspot.all
  end
  
  def show
    @hotspot = Hotspot.find(params[:id])
  end

  # GET /hotspots/new
  # GET /hotspots/new.json
  def new
   @hotspot = Hotspot.new(:tour_id=>params[:tour_id])
  end

  
  def edit
    @hotspot = Hotspot.find(params[:id])
    @hotspot.latitude = params[:latitude]
    @hotspot.longitude = params[:longitude]
    @hotspot.save!
    respond_to do |format|
      format.js
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@hotspot.tour_id}
    end
  end

  # POST /characters
  # POST /characters.json
  def create
    @hotspot = Hotspot.new(:longitude=>params[:longitude],:latitude=>params[:latitude],:tour_id=>params[:tour_id])
    @hotspot.latitude = params[:latitude]
    @hotspot.longitude = params[:longitude]
    @hotspot.save!
    respond_to do |format|
      format.js
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@hotspot.tour_id}
    end
  end
  
  #action to add source materials to a hotspot

  # PUT /characters/1
  # PUT /characters/1.json
  def update
    @hotspot = Hotspot.find(params[:id])
    @hotspot.latitude = params[:latitude]
    @hotspot.longitude = params[:longitude]
    @hotspot.save!
     respond_to do |format|
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@hotspot.tour_id}
    end
  end

  # DELETE /characters/1
  # DELETE /characters/1.json
  def destroy
    @hotspot = Hotspot.find(params[:id])
    @hotspot.destroy
    respond_to do |format|
      format.js
      format.html{redirect_to :controller=>:tours,:action=>:show,:tour_id=>@hotspot.tour_id}
    end
  end


 
end