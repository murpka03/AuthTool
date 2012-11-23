$(function(){
var map;
var markers;
var lines = [];
var points = [];
var circle;
var lineSymbol;
var overlay;
var hoverLine;
var dragStart = false;
var dragging = false;
var lineone;
var linetwo;
var hovertemp;
var infoWindow;
var sitLat;
var sitLng;
var site_id;
var selected_source;

function initialize() {
  $('#editor').hide();
  markers = [];
  infoWindow = new google.maps.InfoWindow();
  var mapOptions = {
    center: new google.maps.LatLng(39.8309293 , -77.2310955),
    zoom: 18,
    panControl: false,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  overlay = new google.maps.OverlayView();
  overlay.draw = function(){};
  overlay.setMap(map);

  lineSymbol = {
    path: 'M 0,0 0,0',
    strokeOpacity: 0.5,
    strokeColor: "#FF0000",
    strokeWeight: 7,
    scale: 4
  };

  circle = new google.maps.Marker({
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 6,
      strokeWeight: 2,
      fillColor: "white",
      fillOpacity: 1.0
    },
    zIndex: 2,
    map: map
  });

  google.maps.event.addListener(circle, 'mousedown', function(event) {
    dragStart = true;
    circle.setMap(null);

    var pointone = hoverLine.getPath().getAt(0);
    var pointtwo = hoverLine.getPath().getAt(1);
    hovertemp = hoverLine;
    
    lineone = drawLine(pointone, event.latLng);
    linetwo = drawLine(event.latLng, pointtwo);
  });
  google.maps.event.addListener(map, 'mousemove', function(event) {
    if(dragStart){
      dragging = true;
      var pointsone = [];
      var pointone = lineone.getPath().getAt(0);
       pointsone.push(pointone);
       pointsone.push(event.latLng);
      var pointstwo = [];
      var pointtwo = linetwo.getPath().getAt(1);
      pointstwo.push(event.latLng);
      pointstwo.push(pointtwo);
      lineone.setPath(pointsone);
      linetwo.setPath(pointstwo);
    }
  });
  for(var i = 0; i < msites.length; i++){
    var marker1 = new google.maps.Marker({
        map:map,
        position: new google.maps.LatLng(msites[i]['latitude'],msites[i]['longitude']),
        zIndex:3,
        draggable:true
    });
    markers.push(marker1);
  }
  
  
}

function setupMarkerListeners(map){
    google.maps.event.addListener(map, 'click', function(event) {
          var markerclick = new google.maps.Marker({
            map:map,
            position:event.latLng,
            zIndex: 3,
            draggable: true
          });
          markers.push(markerclick);
    });
    for(var i= 0; i< markers.length; i++){
        var marker = markers[i];
        google.maps.event.addListener(marker, 'dblclick', function(event) {
            $("#sources").html("");
            site_id = find_site(msites,this);
            if(site_id != 0){
                display_site(site_id);
            }
            infoWindow.setContent('<h2>Drag Source Materials</h2>'); 
          })
          google.maps.event.addListener(marker, 'mouseover', function(event) {
             infoWindow.setContent('<h2>New Landmark</h2><p>Current Lat: ' + this.getPosition().lat() + '<br>Current Long: ' + this.getPosition().lng() + ' </p><p>Drag me to adjust my position.</p>'); 
            infoWindow.open(map,this);   
            circle.setVisible(false);
          })
          google.maps.event.addListener(marker, 'mouseout', function(event) {
            infoWindow.close();
            circle.setVisible(true);
          });
          google.maps.event.addListener(marker, 'rightclick', function(event) {
            if(confirm('Delete this site?')){
              deleteMarker(marker);
            }
          });
    }

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




/*
Draw a polyline between two given points
start - the start point of the polyline created
end - the end point of the polyline created
*/
function drawLine(start, end) {
  var points = [];
  points.push(start);
  points.push(end);
  var line = new google.maps.Polyline({
    map: map,
    icons: [{
      icon: lineSymbol,
      offset: '0',
      repeat: '4px'
    }],
    strokeOpacity: 0.0,
    strokeWeight: 50,
    editable: false,
    zIndex: 1
  });
  line.setPath(points);

  //listeners
  google.maps.event.addListener(line, 'mousemove', function(event) {
    circle.setPosition(event.latLng);
    var projection = overlay.getProjection();
    var pixel = projection.fromLatLngToContainerPixel(event.latLng);
    $("#tooltip").css("display","block");
    $("#tooltip").css("left",pixel.x+15+"px").css("top",pixel.y+125+"px");
    hoverLine = line;
  });

  google.maps.event.addListener(line, 'mouseout', function(event) {
    circle.setPosition(null);
    $("#tooltip").css("display","none");
  });
  google.maps.event.addListener(line, 'mouseup', function(event) {
    circle.setMap(map);
    dragStart = false;
    if(dragging){
      dragging = false;
      for(var i = 0; i < lines.length; i++){
        if(lines[i] == hovertemp){
          lines.splice(i,1);
          hovertemp.setMap(null);
          break;
        }
      }
      lines.push(lineone);
      lines.push(linetwo);
      var pointcompare = linetwo.getPath().getAt(1);
      for(var i = 0; i < points.length; i++){
        if(points[i] == pointcompare){
          points.splice(i,0,event.latLng);
          break;
        }
      }
      createVertex(event.latLng);
    }
    else{
      lineone.setMap(null);
      linetwo.setMap(null);
    }
  });
  return line;
}

/*
Create a vertex at a given position to allow line flexibility
pos - the position where the vertex is created
*/
function createVertex(pos){

  var vertex = new google.maps.Marker({
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 6,
      strokeWeight: 2,
      fillColor: "red",
      fillOpacity: 0.5
    },
    draggable: true,
    position: pos,
    zIndex: 3,
    map: map
  });

  var leftline;
  var rightline;
  var point;

  google.maps.event.addListener(vertex, 'mouseover', function(event) {
    circle.setVisible(false);
  });
  google.maps.event.addListener(vertex, 'mouseout', function(event) {
    circle.setVisible(true);
  });
  google.maps.event.addListener(vertex, 'dragstart', function(event) {
    point = vertex.position;
    for(var i = 0; i < lines.length; i++){
      if(lines[i].getPath().getAt(0).lat() == vertex.position.lat() && 
          lines[i].getPath().getAt(0).lng() == vertex.position.lng()){
        rightline = lines[i];
      }
      if(lines[i].getPath().getAt(1).lat() == vertex.position.lat() &&
          lines[i].getPath().getAt(1).lng() == vertex.position.lng()){
        leftline = lines[i];
      }
    }
  });
  google.maps.event.addListener(vertex, 'drag', function(event) {
    if(leftline){
      var points = [];
      points.push(leftline.getPath().getAt(0));
      points.push(event.latLng);
      leftline.setPath(points);
    }
    if(rightline){
      var points = [];
      points.push(event.latLng);
      points.push(rightline.getPath().getAt(1));
      rightline.setPath(points);
    }
  });
  google.maps.event.addListener(vertex, 'dragend', function(event) {
    for(var i = 0; i < points.length; i++){
      if(points[i] == point){
        points[i] = event.latLng;
        break;
      }
    }
  });
  google.maps.event.addListener(vertex, 'rightclick', function(event) {
    if(confirm('Delete this site?')){
      //delete vertex
    }
  });
}

 $("#site_form").click(function(){
        alert("Sites saved successfully");
        for(var i = 0; i < markers.length; i++){
            var lat = markers[i].getPosition().lat();
            var lng = markers[i].getPosition().lng();
          $.post("/sites",{longitude: lng, latitude:lat, tour_id: tour_id },function(){
            
          }
          )
        }
        
    });
 //methods for editor drag and drop
 function add_photo_to_site(event, ui){
    var url = ui.draggable.attr('src');
    var img = $(event.target).find('.photo img');
    $.post("/sources",{site_id: site_id, image: url},function(){
            
    })
 }
 
 function display_site(id){
        $.get("/sites/"+id,function(){
        
        })
 }
 
 function find_site(sites,marker){
    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
    for(var i = 0; i< sites.length; i++){
        if(sites[i]['latitude']==lat && sites[i]['longitude']==lng){
            return sites[i]['id']
        
        }
    }
    return 0
 }
 
 function save_description(){
    
 }
 
    

    
    $(document).ready(function(){
        initialize();
        //$('#editor .tinymce').tinymce({
        //    settings:{
        //           mode: 'textareas',
        //           theme: 'advanced'
        //            },
        //            saveButton: {
        //                onclick: function(e){
        //                    alert("text saved!");
        //                },
        //                title: "save text"
        //           }
        //});
        setupMarkerListeners(map);  
        $('.photo img').draggable({
        helper: 'clone',
        });
        $('#sources').droppable({
        accept: ".photo img",
        drop: add_photo_to_site
        });
         $('#sources').delegate('.source_image img', 'click', function() {
            var src = this.src;
            if(selected_source){
                $(selected_source).css('border','4px solid white')
            }
            $(this).css('border','4px solid yellow')
            selected_source = this;
            $('#preview').html("");
            $('#preview').append('<img src='+src+'>')
        });
           $('#sources').delegate('.edit_icon img', 'click', function() {
              $('#preview').html("");
              $('#preview').append($("#editor").tinymce({
                mode: 'textareas'
              }).show());
              
            });
        
       
        
    });
});