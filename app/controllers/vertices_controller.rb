class VertexesController < ApplicationController
  
  def index
    @vertexes = Vertex.all
  end
  
  def show
    @vertex = Vertex.find(params[:id])
    respond_to do |format|
      format.js
      format.html
    end
  
  end

  # GET /vertexs/new
  # GET /vertexs/new.json
  def new
    @vertex = Vertex.new(:tour_id=>params[:tour_id])
  #explicitly designate tourid in create
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json:@vertex }
    end
  end

  
  def edit
    @vertex = Vertex.find(params[:id])
  end

  # POST /characters
  # POST /characters.json
  def create
    @vertex = Vertex.create(:tour_id=>params[:tour_id])
    @vertex.latitude = params[:latitude]
    @vertex.longitude = params[:longitude]
    @vertex.save!
  end
  
  #action to add source materials to a vertex

  # PUT /characters/1
  # PUT /characters/1.json
  def update
  
  end

  # DELETE /characters/1
  # DELETE /characters/1.json
  def destroy
    @vertex = Vertex.find(params[:id])
    @vertex.destroy

    respond_to do |format|
      format.html { redirect_to 'sessions/profile' }
      format.json { head :no_content }
    end
  end


 
end