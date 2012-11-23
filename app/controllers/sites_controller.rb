class SitesController < ApplicationController

  def index
    #@site = Site.new
    
    #@json = Site.all.to_gmaps4rails
    # @polylines = [
    #   {"lng": -80.190262, "lat": 25.774252, "strokeColor": "#000"},
    #   {"lng": -66.118292, "lat": 18.4664}
    #  ]
    # @polylines = @polylines.to_json

    #respond_to do |format|
    #  format.html # index.html.erb
    #  format.json { render json: @sites }
    #
  end
   # GET /sites/1
  # GET /sites/1.json
  def show
    @site = Site.find(params[:id])
    respond_to do |format|
      format.js
      format.html
    end
  
  end

  # GET /sites/new
  # GET /sites/new.json
  def new
    @site = Site.new(:longitude=>params[:longitude],:latitude=>params[:latitude],:tour_id=>params[:tour_id])
  #explicitly designate tourid in create
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json:@site }
    end
  end

  
  def edit
    @site = Site.find(params[:id])
  end

  # POST /characters
  # POST /characters.json
  def create
    @site = Site.create(:longitude=>params[:longitude],:latitude=>params[:latitude],:tour_id=>params[:tour_id])
  end
  
  #action to add source materials to a site

  # PUT /characters/1
  # PUT /characters/1.json
  def update
    @site = Site.find(params[:id])

    respond_to do |format|
      if @character.update_attributes(params[:site])
        format.html { redirect_to @site, notice: 'Character was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @site.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def add_sources
    @site = Site.find(params[:id])
    
  end

  # DELETE /characters/1
  # DELETE /characters/1.json
  def destroy
    @site = Site.find(params[:id])
    @site.destroy

    respond_to do |format|
      format.html { redirect_to site_url }
      format.json { head :no_content }
    end
  end
end