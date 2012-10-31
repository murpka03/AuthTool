Photos::Application.routes.draw do
  
  root :to => "sessions#home"
  resources :photos
  match "profile/:user_id/photos", :to => "photos#index"
  match "profile/:user_id/new", :to => "photos#new"
  match "signup", :to => "users#new"
  match "login", :to => "sessions#login"
  match "logout", :to => "sessions#logout"
  match "home", :to => "sessions#home"
  match "profile", :to => "sessions#profile"
  match "setting", :to => "sessions#setting"
  match "edit", :to => "users#edit"
  
  #new
  match "admin", :to => "users#admin"
  

  match ':controller(/:action(/:id))(.:format)'

end
