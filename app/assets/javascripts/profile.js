$(document).ready(function(){

   $('img').click(function(e){
      $.facebox($('<img>',{
         src: this.src
      }));
   })

});