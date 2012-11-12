
$(function(){
    var map;
    var markers = [];
    var line;
    
    function initialize() {
      var mapOptions = {
        center: new google.maps.LatLng(39.8309293 , -77.2310955),
        zoom: 18,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.HYBRID
      };
      map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
      for(var i = 0; i< msites.length; i++){
        placeMarker(msites[i]);
      }
      line = new google.maps.Polyline({
        map: map,
        strokeColor: "#FF0000",
        strokeOpacity: 0.5,
        strokeWeight: 6,
        editable: true
      });
      google.maps.event.addListener(line, 'rightclick', function(event) {
        if(event.vertex != null) {
          line.getPath().removeAt(event.vertex);
        }
      });
        
      google.maps.event.addListener(map, 'click', function(event) {
        var marker = new google.maps.Marker({
          map: map,
          position: event.latLng,
          draggable: true
        });
    
        markers.push(marker);
        var index = getMarkerNum(marker);
        updateInfoWindow(index, marker);
        var position = 0;
        if(markers.length != 1){ //last marker so far
          position = line.getPath().length;
        }
        drawLine(position, marker.getPosition());
    
        google.maps.event.addListener(marker, 'mouseover', function(event) {
          marker['infowindow'].open(map,marker);
        });
        google.maps.event.addListener(marker, 'mouseout', function(event) {
          marker['infowindow'].close();
        });
        google.maps.event.addListener(marker, 'dragstart', function(event) {
          position = findPos(marker);
          marker['infowindow'].close();
        });
        google.maps.event.addListener(marker, 'drag', function(event) {
          marker['infowindow'].close();
        });
        google.maps.event.addListener(marker, 'dragend', function(event) {
          drawLine(position, marker.getPosition());
          marker['infowindow'].close();
          updateInfoWindow(marker['infowindow'].zindex, marker);
        });
         google.maps.event.addListener(marker, 'rightclick', function(event) {
            if(confirm('Delete this site?')){
              deleteMarker(marker);
            }
          });
         
      });
    
      //search text field
      var input = document.getElementById('searchTextField');
      var options = {
        types: ['geocode']
      };
    
    
      autocomplete = new google.maps.places.Autocomplete(input, options);
    
      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          // Inform the user that a place was not found and return.
          return;
        }
        // If the place has a geometry, then present it on a map.
        //if (place.geometry.viewport) {
          // Use the viewport if it is provided.
          // Gmaps.map.serviceObject.fitBounds(place.geometry.viewport);
        //} 
        else {
          // Otherwise use the location and set a chosen zoom level.
          map.setCenter(place.geometry.location);
          map.setZoom(18);
        }
      });
    }
    
     function deleteMarker(m){

        for(var i =0; i < markers.length; i++){
          if(markers[i].position.lat() == m.position.lat() && markers[i].position.lng() == m.position.lng() ){
            m.setMap(null);
            markers.splice(i,1);
            break;
          }
        }
      }
      
      function placeMarker(m){
        var marker = new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(m['latitude'] , m['longitude']),
          draggable: true
        });
      }
    
    //update infowindow
    function updateInfoWindow(i, m){
      // Set infowindow
      m['infowindow'] = new google.maps.InfoWindow({
        zindex: i,
        content: '<h2>Landmark ' + i + '</h2><p>Current Lat: ' + m.position.lat() + '<br>Current Long: ' + m.position.lng() + ' </p><p>Drag me to adjust my position.</p>'
      });
    }
    
    function getMarkerNum(m){
      for(var i = 0; i < markers.length; i++){
        if(m.position.lat() == markers[i].position.lat() && m.position.lng() == markers[i].position.lng()){
          return i+1;
        }
      }
      return -1;
    }
    
    function findPos(m) {
      var points = line.getPath();
      for(var i = 0; i < points.length; i++){
        if(points.getAt(i).lat() == m.position.lat() && points.getAt(i).lng() == m.position.lng()){
          return i;
        }
      }
      return points.length; //new marker added to end of path
    }
        
    function set_latlng_to_input(marker){
        //$("#latitude").val(marker.getPosition().lat());
        //$("#longitude").val(marker.getPosition().lng());
    }
    
    $("#site_form").click(function(){
        alert("Sites saved successfully");
        for(var i = 0; i < markers.length; i++){
            var lat = markers[i].position.lat();
            var lng = markers[i].position.lng();
          $.post("/sites",{longitude: lng, latitude:lat, tour_id: '1' },function(){
            
          }
          );
        }
        
    })
    function drawLine(p, latlng) {
      var points = [];
      if(p == 0 && !line.getPath()){//first marker
        points.push(latlng);
      }
      else{
        var oldpath = line.getPath();
        for(var i = 0; i < oldpath.length; i++){
          if(i == p){
            points.push(latlng);
          }
          else{
            points.push(oldpath.getAt(i));
          }
        }
      }
      if(p == line.getPath().length){ //last marker
        points.push(latlng);
      }
      line.setPath(points);
    }
    $(document).ready(function(){
        initialize();
        

    });
    
});