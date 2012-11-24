$(document).ready(function() {
    
    var toggly = $('.collapsable')
    $(toggly).addClass('hidden');
    
    var toggly1 = $('.collapsable1')
    $(toggly1).addClass('hidden');
    
   $('.btn-toggle').toggle(function() {
    $('.collapsable').removeClass('hidden');
   }, function() {
    $('.collapsable').addClass('hidden');
   });
   
   $('.btn-toggle1').toggle(function() {
    $('.collapsable1').removeClass('hidden');
   }, function() {
    $('.collapsable1').addClass('hidden');
   });
});