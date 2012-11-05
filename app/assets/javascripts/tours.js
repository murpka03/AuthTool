
$(function(){
    var map;
    var markers = [];
    var line;
    var latt;
    var langg;
    
    function initialize() {
      var mapOptions = {
        center: new google.maps.LatLng(39.8309293 , -77.2310955),
        zoom: 18,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.HYBRID
      };
      map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
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
    
        
        set_latlng_to_input(marker);
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
        latt = $("#latitude");
        lngg = $("#longitude");
    function set_latlng_to_input(marker){
        latt.val(marker.getPosition().lat());
        lngg.val(marker.getPosition().lng());
    }
    
    $("#site_form").click(function(){
       
        for(var i = 0; i < markers.length; i++){
          set_latlng_to_input(markers[i]);   
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
    $(window).load(function(){
        initialize();
        
    });
    
});