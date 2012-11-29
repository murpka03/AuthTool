class DescriptionsController < ApplicationController
  
  
  def index
    @descriptions = Description.all
    @descriptions = @descriptions.to_json
    
  end
  
  def new
    @description = Description.new(:text=>params[:text])
    respond_to do |format|
      format.js 
      format.html
    end
  end
  
  def show
    @description = Description.find(params[:id])
    @description = @description.to_json
    respond_to do |format|
      format.html
    end
  end
  
  
  def create
    @description = Description.new(:text=>params[:text])
    if !params[:source_id].nil?
      @description.source_id = params[:source_id]
    end
    if !params[:tour_id].nil?
       @description.tour_id = params[:tour_id]
    end
    @description.save!
    respond_to do |format|
      format.html {render 'sessions/profile'}
    end
  end
  end
  
  def edit
    @description = Description.find(params[:id])
  end

  def update
    @description = Description.find(params[:id])
    if params[:site_id]
      @description.source_id = params[:source_id]
      @description.save!
    end
  end

  def destroy
    @description = Description.find(params[:description_id])
    @description.destroy
    redirect_to :controller=>:tours, :action=>:show
    flash[:notice] = "Description removed from library."
  end
  
  
  
end
