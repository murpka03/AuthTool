class User < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_accessor :password
<<<<<<< HEAD
  attr_accessible :username, :email, :password, :password_confirmation, :is_admin, :is_accepted
  has_many :folders
  has_many :tours
  attr_accessible :folders
  attr_accessible :tours
=======
  attr_accessible :username, :email, :password, :password_confirmation, :is_admin
  has_many :photos
  attr_accessible :photos
>>>>>>> 305715122f28973ce0ff144f2e716044eafea6ad
  EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i
  validates :username, :presence => true, :uniqueness => true, :length => { :in => 3..20}
  validates :email, :presence => true, :uniqueness => true, :format => EMAIL_REGEX
  validates :password, :confirmation => true #password confrimation attr
<<<<<<< HEAD
  validates_length_of :password, :in => 6..20, :on => :create
  validates :is_admin, :inclusion => {:in => [true, false]}
  validates :is_accepted, :inclusion => {:in => [true, false]}
=======
  validates :is_admin, :inclusion => {:in => [true, false]}
  validates_length_of :password, :in => 6..20, :on => :create
>>>>>>> 305715122f28973ce0ff144f2e716044eafea6ad
  
  before_save :encrypt_password
  after_save :clear_password
  
  def encrypt_password
    if password.present?
      self.salt = BCrypt::Engine.generate_salt
      self.encrypted_password= BCrypt::Engine.hash_secret(password,salt)
    end
  end
  
  def clear_password
    self.password = nil
  end
  
  def self.authenticate(username_or_email="", login_password="")
    if EMAIL_REGEX.match(username_or_email)
      user = User.find_by_email(username_or_email)
    else
      user = User.find_by_username(username_or_email)
    end
<<<<<<< HEAD
    if user && user.match_password(login_password) && user.is_accepted
=======
    if user && user.match_password(login_password)
>>>>>>> 305715122f28973ce0ff144f2e716044eafea6ad
      return user
    else
      return false
    end
  end
  
  def match_password(login_password="")
    encrypted_password == BCrypt::Engine.hash_secret(login_password, salt)
  end
  
end
