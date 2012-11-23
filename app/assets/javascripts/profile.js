$(document).ready(function($){
   var selected;
   $('.photo img').dblclick(function(e){
      $.facebox($('<img>',{
         src: this.src
      }));
   });
   $('.photo').click(function(e){
     selected = $(this);
   });
   $(".fol").click(function(e){
      if(selected){
         selected.find('.folder').css('background-color','white');
      }
    $(this).find('.folder').css('background-color', '#EEE');
     selected = $(this);
   });
   $(".fol").dblclick(function(e){
    //add behavior
   });
   $(".fol").hover(function(e){
    //add behavior
   });
   $('#new_fol').live('click',function(e){
      e.preventDefault();
      if(selected){
         selected.find('.add_folder .CRAZY').trigger('click');
      }
      else{
         $('#folder_form .btn').trigger('click');
      }
   });
    $('#new_pho').click(function(e){
      e.preventDefault();
     if(selected){
      selected.find('.add .btn').trigger('click');
     }
   });
    $('#delete_tool').click(function(e){
      e.preventDefault();
      if(selected){
         selected.find('.delete .btn').trigger('click');
      }
    });

});