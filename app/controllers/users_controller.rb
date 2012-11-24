class UsersController < ApplicationController
  
  before_filter :save_login_state, :only => [:new, :create]
  
  
  def index
    #@users = User.all
  end
  
  def new
    @user = User.new
  end
  
  def create
    @user = User.new(params[:user])
        if @user.save
          flash[:notice] = "You Signed up"
          flash[:color]="valid"
          redirect_to(:controller => 'sessions', :action => 'login')
        else
          flash[:notice] = "Form is invalid"
          flash[:color]="invalid"
          render "new"
        end
  end
  
  def edit
    @user = User.find session[:user_id]
  end

  def update
    @user = User.find session[:user_id]
    @user.username = params[:username]
    if @user.save
      # Handle a successful update.
      redirect_to(:controller => 'sessions', :action => 'home')
    else
      render 'edit'
    end
  end
  
  def destroy
    @user = User.find(params[:id])
    @user.destroy
    redirect_to(:controller => 'sessions', :action => 'profile')
  end
  
  
  
end
