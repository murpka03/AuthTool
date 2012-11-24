$(document).ready(function() {
    
    var toggly = $('.collapsable')
    $(toggly).addClass('hidden');
    
<<<<<<< HEAD
    var toggly1 = $('.collapsable1')
    $(toggly1).addClass('hidden');
    
=======
>>>>>>> 305715122f28973ce0ff144f2e716044eafea6ad
   $('.btn-toggle').toggle(function() {
    $('.collapsable').removeClass('hidden');
   }, function() {
    $('.collapsable').addClass('hidden');
   });
<<<<<<< HEAD
   
   $('.btn-toggle1').toggle(function() {
    $('.collapsable1').removeClass('hidden');
   }, function() {
    $('.collapsable1').addClass('hidden');
   });
=======
>>>>>>> 305715122f28973ce0ff144f2e716044eafea6ad
});