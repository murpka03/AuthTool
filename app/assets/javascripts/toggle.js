$(document).ready(function() {
    
    var toggly = $('.collapsable')
    $(toggly).addClass('hidden');
    
   $('.btn-toggle').toggle(function() {
    $('.collapsable').removeClass('hidden');
   }, function() {
    $('.collapsable').addClass('hidden');
   });
});