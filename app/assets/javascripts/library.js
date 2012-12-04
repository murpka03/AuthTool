
//will display the selected folder and its contents
//its child folders will be rendered on the folder_table
//and the images will be in the photo_table
function display_folder(folder_id){
   $.get('/folders/'+folder_id,function(){});
}
//will display the top level folders of the library
function display_home(){
   //if this is being called from the library on the 'tours' page
   $.get('/folders',{user_id: user_id},function(){})
}
//listener for when a '.label' div is clicked on the folder_table
//displays images in folder
//replaces folders on the folder_panel with its children
//appends to the '#directory_trail div'
// folder_label --> the '.label' div that was clicked 
function folderLabelClick(folder_label){
   var folder_id = folder_label.data('fid');
   var folder_name = folder_label.text();
   $('#directory_trail').animate({
      width: $('#directory_trail').width()+55
   },300);
   var new_trail = $("<div class='folder_trail' data-fid ="+folder_id+">"+ folder_name+"</div>");
   $('#directory_trail').append(new_trail);
   new_trail.css({
      left: $('#directory_trail').width()
   });
   display_folder(folder_id);
}
//listener for when a folder_trail div is clicked
function folderTrailClick(folder_trail){
   var folder_id = folder_trail.data('fid');
   //remove following trails
   var num_removed = folder_trail.nextAll().length;
   folder_trail.nextAll().remove();
   $('#directory_trail').animate({
      width: $('#directory_trail').width()- (55*num_removed)
   },300);
   //decrease with of the '#directory_trail'
   //check to see if the 'home' folder_trail was clicked
   if(folder_id == 'home'){
      display_home();
   }
   //selected folder_trail was not 'home' 
   else{
      display_folder(folder_id); //display the folder that you clicked on 
   }
}
$(document).ready(function(){
   var selectedFolder;
    $('#content_display').delegate('.photo','mouseover',function(e){
      //call tooltip
   });
   $('#content_display').delegate('.photo','click',function(e){
      var img = $(this).find('.photo_image');
      var url = img.attr('src');
      $.facebox({image: url});
   });
   $('#folder_table').delegate('.label','dblclick',function(e){
      selectedFolder = $(this).data('fid');
      folderLabelClick($(this));
      e.stopPropagation();
   });
   //handle directory_trail clicks
   $('#directory_trail').delegate('.folder_trail','click',function(e){
      folderTrailClick($(this));
   });
   $('#new_folder').click(function(){
      $.get('/folders/new',{parent_id: 0, user_id: user_id},function(){});
   })
    $('#new_photo').click(function(e){
     if(selectedFolder){
      $.get('/photos/new',{user_id: user_id,folder_id: selectedFolder},function(){
      })
     }
     else{
      alert('Select a folder before uploading files')
     }
   });

});