class DescriptionsController < ApplicationController
  
  
  def index
    @descriptions = Description.all
    @descriptions = @descriptions.to_json
    
  end
  
  def new
    if params[:source_id]
       @description = Description.new(:text=>params[:text],:source_id=>params[:source_id])
    end
    if params[:site_id]
       @description = Description.new(:text=>params[:text],:site_id=>params[:site_id])
    end
    if params[:tour_id]
       @description = Description.new(:text=>params[:text],:tour_id=>params[:tour_id])
    end
    respond_to do |format|
      format.js
      format.html {render }
    end
  end
  
  def show
    @description = nil
    if params[:source_id]
      @source = Source.find(params[:source_id])
      @description = @source.description
    end
    if params[:site_id]
      @site = Site.find(params[:site_id])
      @description = @site.description
    end
    if params[:tour_id]
      @tour = Tour.find(params[:tour_id])
      @description = @tour.description
    end
    if @description.nil?
      render 'new'
    end
    if !@description.nil?
      respond_to do |format|
        format.js
      end
    end
  end
  
  
  def create
    if params[:source_id]
       @description = Description.new(:text=>params[:text],:source_id=>params[:source_id])
    end
    if params[:site_id]
       @description = Description.new(:text=>params[:text],:site_id=>params[:site_id])
    end
    if params[:tour_id]
       @description = Description.new(:text=>params[:text],:tour_id=>params[:tour_id])
    end
    @description.save!
    respond_to do |format|
      format.html {render 'sessions/profile'}
    end
  end
  
  def edit
    @description = Description.find(params[:id])
    @description.text = params[:text]
    @description.save!
    respond_to do |format|
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@@current_tour}
    end
  end

  def update
    @description = Description.find(params[:id])
    @description.text = params[:text]
    @description.save!
    respond_to do |format|
      format.html {redirect_to :controller=>:tours,:action=>:show,:tour_id=>@@current_tour}
    end
  end

  def destroy
    @description = Description.find(params[:description_id])
    @description.destroy
    redirect_to :controller=>:tours, :action=>:show
    flash[:notice] = "Description removed from library."
  end
  
  
  
end
