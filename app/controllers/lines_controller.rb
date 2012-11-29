class LinesController < ApplicationController
  
  def index
    @lines = Line.all
    respond_to do |format|
      format.html 
      format.json 
    end
  end
  
  def show
    @line = Line.find(params[:id])
  end

  # GET /lines/new
  # GET /lines/new.json
  def new
    @line = Line.new(:tour_id=>params[:tour_id])
  #explicitly designate tourid in create
    
  end

  
  def edit
    @line = Line.find(params[:id])
  end

  # POST /characters
  # POST /characters.json
  def create
    @line = Line.create(:tour_id=>params[:tour_id])
    @line.slat = params[:slat]
    @line.slng = params[:slng]
    @line.elat = params[:elat]
    @line.elng = params[:elng]
    @line.save!
    respond_to do |format|
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@line.tour_id}
    end
  end
  
  #action to add source materials to a line

  # PUT /characters/1
  # PUT /characters/1.json
  def update
  
  end

  # DELETE /characters/1
  # DELETE /characters/1.json
  def destroy
    @line = Line.find(params[:id])
    @line.destroy

    respond_to do |format|
      format.html { redirect_to 'sessions/profile' }
      format.json { head :no_content }
    end
  end


 
end