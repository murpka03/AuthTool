class HotspotsController < ApplicationController
  
  def index
    @hotspots = Hotspot.all
  end
  
  def show
    @hotspot = Hotspot.find(params[:id])
    respond_to do |format|
      format.js
      format.html
    end
  
  end

  # GET /hotspots/new
  # GET /hotspots/new.json
  def new
    @hotspot = Hotspot.new(:tour_id=>params[:tour_id])
  #explicitly designate tourid in create
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json:@hotspot }
    end
  end

  
  def edit
    @hotspot = Hotspot.find(params[:id])
  end

  # POST /characters
  # POST /characters.json
  def create
    @hotspot = Hotspot.create(:tour_id=>params[:tour_id])
    @hotspot.latitude = params[:latitude]
    @hotspot.longitude = params[:longitude]
    @hotspot.save!
  end
  
  #action to add source materials to a hotspot

  # PUT /characters/1
  # PUT /characters/1.json
  def update
  
  end

  # DELETE /characters/1
  # DELETE /characters/1.json
  def destroy
    @hotspot = Hotspot.find(params[:id])
    @hotspot.destroy

    respond_to do |format|
      format.html { redirect_to 'sessions/profile' }
      format.json { head :no_content }
    end
  end


 
end