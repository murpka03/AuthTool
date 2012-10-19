class ApplicationController < ActionController::Base
  protect_from_forgery
  protected
  
  before_filter :reset_session
  @@session = false
  
  def reset_session
    puts "reset session"
    puts nil
    if (@@session == false || @@session == nil)
      @@session = true
      session[:user_id] = nil
    end
  end
    def authenticate_user
      unless session[:user_id]
        puts "not logged in"
        redirect_to(:controller=>'sessions', :action => 'login')
        return false
      else
        puts "already logged in"
        #set the current user object to @current_user object variable
        puts session[:user_id]
        @current_user = User.find session[:user_id]
        return true
      end
    end
    
    def save_login_state
      if session[:user_id]
        redirect_to(:controller => 'sessions', :action => 'login')
        return false
      else
        return true
      end
    end
end
