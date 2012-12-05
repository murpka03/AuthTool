class SitesController < ApplicationController

  def index
    @tour = Tour.find(params[:tour_id])
    @sites = @tour.sites
    @sites = @sites.to_json
    respond_to do |format|
      format.js
    end
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
    end
  end

  
  def edit
    @site = Site.find(params[:id])
    @site.latitude = params[:latitude]
    @site.longitude = params[:longitude]
    @site.tour_id = params[:tour_id]
    @site.save!
    respond_to do |format|
      format.js
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@site.tour_id}
    end
  end

  # POST /characters
  # POST /characters.json
  def create
    @site = Site.new(:longitude=>params[:longitude],:latitude=>params[:latitude],:tour_id=>params[:tour_id])
    @site.tour_id = params[:tour_id]
    @site.save!
    respond_to do |format|
      format.js
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@site.tour_id}
    end
  end
  
  #action to add source materials to a site

  # PUT /characters/1
  # PUT /characters/1.json
  def update
    @site = Site.find(params[:id])
    @site.latitude = params[:latitude]
    @site.longitude = params[:longitude]
    @site.tour_id = params[:tour_id]
    @site.save!
    respond_to do |format|
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@site.tour_id}
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
      format.js
      format.html{redirect_to :controller=>:tours,:action=>:show,:tour_id=>@site.tour_id}
    end
  end
end