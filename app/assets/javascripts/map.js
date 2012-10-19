$(function(){
 
  var map;
 
  function retrieve(callback) {
    setTimeout(function() {
      callback.call();
    }, 500);
  }
  function init_map(){
    var latlng = new google.maps.LatLng(39.828333,  -77.232222);
    var myOptions = {
        zoom: 12,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map'),myOptions);
  }
  
  //initialize the page
  $(window).load(function(){
    init_map(); 
  });
  
  
  
}); 