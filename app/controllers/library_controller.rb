class LibraryController < ApplicationController
  

  def show
   @user = User.find(user_id)
   #@user = User.find(params[:user_id])
   #for f in @user.folders
   #  library.add(f)
   #end
   respond_to do |format|
     format.html 
   end
  end

  # @item is set in require_existing_item
  def create
    library.add(@item)
    redirect_to folder_url(params[:folder_id]), :notice => t(:added_to_library)
  end

  # @item is set in require_existing_item
  def destroy
    library.remove(@item)
    redirect_to folder_url(params[:folder_id])
  end




 
end