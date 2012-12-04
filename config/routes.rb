Photos::Application.routes.draw do
  
  
  

  root :to => "sessions#home"
  resources :photos
  resources :folders
  resources :sites
  resources :sources
  resources :tours
  resources :descriptions
  resources :hotspots
  resources :lines
  resources :vertices
  match "signup", :to => "users#new"
  match "login", :to => "sessions#login"
  match "logout", :to => "sessions#logout"
  match "home", :to => "sessions#home"
  match "profile", :to => "sessions#profile"
  match "setting", :to => "sessions#setting"
  match "edit", :to => "users#edit"
  match '/sites/photos', :to=> "photos#add_to_site", :via=> :post
  match "library/:user_id", :to => "library#show", :via=>:get
  match "profile/:user_id/sites", :to => "sites#index"
  match ':controller(/:action(/:id))(.:format)'

end
