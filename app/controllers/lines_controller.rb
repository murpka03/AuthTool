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
    @line.slat = params[:slat] if params[:slat]
    @line.slng = params[:slng] if params[:slng]
    @line.elat = params[:elat] if params[:elat]
    @line.elng = params[:elng] if params[:elng]
    @line.tour_id = params[:tour_id]
    @line.save!
    respond_to do |format|
      format.js
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@line.tour_id}
    end
  end

  # POST /characters
  # POST /characters.json
  def create
    @line = Line.new(:tour_id=>params[:tour_id])
    @line.slat = params[:slat]
    @line.slng = params[:slng]
    @line.elat = params[:elat]
    @line.elng = params[:elng]
    @line.save!
    respond_to do |format|
      format.js
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@line.tour_id}
    end
  end
  
  #action to add source materials to a line

  # PUT /characters/1
  # PUT /characters/1.json
  def update
    @line = Line.find(params[:id])
     respond_to do |format|
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@line.tour_id}
    end
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