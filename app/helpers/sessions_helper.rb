module SessionsHelper
  
  def approve(user)
    user.is_accepted = true
  end
  
end
