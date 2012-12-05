class VerticesController < ApplicationController
  
  def index
    @vertices = Vertex.all
  end
  
  def show
    @vertex = Vertex.find(params[:id])
  end

  # GET /vertexs/new
  # GET /vertexs/new.json
  def new
   @vertex = Vertex.new(:tour_id=>params[:tour_id])
  end

  
  def edit
    @vertex = Vertex.find(params[:id])
    @vertex.latitude = params[:latitude]
    @vertex.longitude = params[:longitude]
    @vertex.save!
    respond_to do |format|
      format.js
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@line.tour_id}
    end
  end

  # POST /characters
  # POST /characters.json
  def create
    @vertex = Vertex.new(:tour_id=>params[:tour_id])
    @vertex.latitude = params[:latitude]
    @vertex.longitude = params[:longitude]
    @vertex.save!
    respond_to do |format|
      format.js
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@vertex.tour_id}
    end
  end
  
  #action to add source materials to a vertex

  # PUT /characters/1
  # PUT /characters/1.json
  def update
    @vertex = Vertex.find(params[:id])
    @vertex.latitude = params[:latitude]
    @vertex.longitude = params[:longitude]
    @vertex.save!
     respond_to do |format|
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@vertex.tour_id}
    end
  end

  # DELETE /characters/1
  # DELETE /characters/1.json
  def destroy
    @vertex = Vertex.find(params[:id])
    @vertex.destroy

    respond_to do |format|
      format.js
      format.html{redirect_to :controller=>:tours,:action=>:show,:tour_id=>@vertex.tour_id}
    end
  end


 
end