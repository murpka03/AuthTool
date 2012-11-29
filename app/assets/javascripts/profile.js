function display_folder(folder_id){
   $.get('/folders/'+folder_id,function(){});
}

$(document).ready(function(){
   var selected;
   var selectedFolder;
   $('#photo_table').delegate('.photo img','dblclick',function(e){
      e.preventDefault();
      e.stopPropagation();
      $.facebox($('<img>',{
         src: this.src
      }));
   });
   $('#photo_table').delegate('.folder','dblclick',function(e){
      $('#photo_table').html('');
      $.get('/folders/'+selectedFolder,function(){});
   });
   $('#photo_table').delegate('.folder','click',function(e){
      selectedFolder = $(this).data('fid');
   });
   $(".label").click(function(){
     selectedFolder = $(this).data('fid');
   })
   $(".label").mouseenter(function(){
   })
    $(".label").mouseleave(function(){
   })
    $('#folder_table').click(function() {
    });
   $(".label").dblclick(function(e){
      selectedFolder = $(this).data('fid');
      $('#photo_table').html("");
      display_folder(selectedFolder);
   })
   $('#new_folder').click(function(){
      alert(user_id);
      if(selectedFolder){
         $.get('/folders/new',{parent_id: selectedFolder, user_id: user_id},function(){});
      }
      else{
         $.get('/folders/new',{parent_id: 0, user_id: user_id},function(){});
      }
   })
    $('#new_photo').click(function(e){
     if(selectedFolder){
      $.get('/photos/new',{user_id: user_id,folder_id: selectedFolder},function(){
      })
     }
   });
    $('#delete_tool').click(function(e){
      if(selected){
         selected.find('.delete').trigger('click');
      }
    });

});