class SessionsController < ApplicationController
  
  before_filter :authenticate_user, :only => [:home, :profile, :setting]
  before_filter :save_login_state, :only => [:login, :login_attempt]
  
  def login
  end
  
  def logout
    session[:user_id] = nil
    redirect_to :action => 'login'
  end
  
  def login_attempt
    @attempt = true
    @error_message = "Invalid Username or Password"
    authorized_user = User.authenticate(params[:username_or_email],params[:login_password])
    if authorized_user
      session[:user_id] = authorized_user.id
      flash[:notice] = "Welcome again, you logged in as #{authorized_user.username}"
      redirect_to(:action => 'profile')
    else
      @attempt = false
      flash[:notice] = "Invalid Username or Password"
      flash[:color] = "invalid"
      render "login"
    end
  end

  def home
    if session[:user_id].nil? 
      redirect_to :action => 'login' 
    else
      redirect_to :action => 'profile' 
    end 
  end

  def profile
    if session[:user_id].nil?
      redirect_to :action=> 'login'
    else
      @user = User.find session[:user_id]
      @admin = @user.is_admin
      @users = User.all
      @current_user = @user
    end
  end
  
  def accept_user
    @user = User.find(params[:id])
    @user.is_accepted = true
    @user.save
    UserMailer.welcome_email(@user).deliver 
    redirect_to :action => 'profile'
  end

  def setting
  end
end
