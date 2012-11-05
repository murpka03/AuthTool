class ToursController < ApplicationController

  def show
    @tour = current_user.tours.first
  end

end