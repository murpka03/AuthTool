class SourcesController < ApplicationController
  
  
  def index
    @sources = Source.all
  end
  
  def new
    @source = Source.new(:image=>params[:image])
    respond_to do |format|
      format.html {render 'sessions/profile'}
    end
  end
  
  
  def show
    @source = Source.find(params[:id])
    respond_to do |format|
      format.html
      end
  end
  
  def create
    @source = Source.new(:image=> params[:image],:site_id=> params[:site_id])
    @source.image = params[:image]
    if @source.save!
    respond_to do |format|
      format.js 
      format.html {render 'sessions/profile'}
    end
  end
  end
  
  def edit
    @source = Source.find(params[:id])
  end

  def update
    @source = Source.find(params[:id])
    if params[:site_id]
      @source.site_id = params[:site_id]
      @source.save!
    end
  end

  def destroy
    @source = Source.find(params[:source_id])
    @source.destroy
    redirect_to :controller=>:tours, :action=>:show
    flash[:notice] = "Source removed from library."
  end
  
  
  
end
