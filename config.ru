# This file is used by Rack-based servers to start the application.

<<<<<<< HEAD
ENV['GEM_HOME']="#{ENV['HOME']}/.gems"
ENV['GEM_PATH']="#{ENV['GEM_HOME']}:/usr/lib/ruby/gems/1.9.1"
require 'rubygems'
Gem.clear_paths

=======
>>>>>>> 305715122f28973ce0ff144f2e716044eafea6ad
require ::File.expand_path('../config/environment',  __FILE__)
run Photos::Application
