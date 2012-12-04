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
  end
  
  def show
    @@profile = false
    @@tour_bool = true
    @tour = Tour.find(params[:tour_id])
    @@current_tour = @tour.id
    @lines = []
    @hotspots = []
    @vertices = []
    @tsites = []
    @tour.sites.each do |site|
      @tsites << site
    end
    @tour.vertices.each do |vertex|
      @vertices << vertex
    end
    @tour.hotspots.each do |hotspot|
      @hotspots << hotspot
    end
    if !@tour.lines.empty?
      @tour.lines.each do |line|
        @lines << line
      end
    end
    @tsites = @tour.sites.to_json
    @lines = @lines.to_json
    @vertices = @vertices.to_json
    @hotspots = @hotspots.to_json
  end
  

end