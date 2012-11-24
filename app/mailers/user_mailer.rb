class UserMailer < ActionMailer::Base
    default :from => "notifications@example.com"
 
  def welcome_email(user)
    @user = user
    @url  = "www.gettysburgcomputerscience.org"
    mail(:to => user.email, :subject => "Approved")
  end
end
