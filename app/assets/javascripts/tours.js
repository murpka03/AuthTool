$(function(){
var map;
var lines = [];
var points = [];
var markers = [];
var vertices = [];
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
var pois = [];
var site_id;
var site_div;
var line_id;
var line_div;
var lines2;
var site_lines;
var selected_source;
var wheel;
var drawn;
var tour_editor;
var source_editor;
var site_editor;
var vertices_div;
var hotspots_div;

function initialize() {

  site_id = 0;
  site_div = null;
  line_id = 0;
  line_div = null;
  site_lines = [];
  infoWindow = new google.maps.InfoWindow();
  var mapOptions = {
    center: new google.maps.LatLng(39.8309293 , -77.2310955),
    zoom: 18,
    panControl: false,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  
  lineSymbol = {
    path: 'M 0,0 0,0',
    strokeOpacity: 0.5,
    strokeColor: "#FF0000",
    strokeWeight: 7,
    scale: 4
  };
  //load saved sites to map from the db


  wheel = new google.maps.Marker({
          icon: {
            url: '/assets/wheel.gif',
            anchor: new google.maps.Point(30,40)
          },
          zIndex: 2,
          map: map,
          optimized: false
  });

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
    for(var i = 0; i< lines.length; i++){
        if(lines[i] == hoverLine){
            hoverPos = i;
            break;
        }
    }
    
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
            map.setOptions({draggable: false});
          }
        });
        google.maps.event.addListener(map, 'mouseup', function(event) {
          if(dragging){
            dragging = false;
            var linecopy1 = drawLine(lineone.getPath().getAt(0), lineone.getPath().getAt(1));
            var linecopy2 = drawLine(linetwo.getPath().getAt(0), linetwo.getPath().getAt(1));
            lineone.setMap(null);
            linetwo.setMap(null);
            //get the current line  
            //remove dragging line from database
            var remove_id = findLine(hoverLine);
            $.post('/lines'+remove_id,{_method:'delete'},function(){})
            //add lineone to db
            var slat1 = linecopy1.getPath().getAt(0).lat();var slng1 = linecopy1.getPath().getAt(0).lng();
            var elat1 = linecopy1.getPath().getAt(1).lng();var elng1 = linecopy1.getPath().getAt(1).lng();
            $.post('/lines',{slat:slat1,slng:slng1,elat:elat1,elng:elng1,tour_id:tour_id},function(){})
            
            //add linetwo to db
            var slat2 = linecopy2.getPath().getAt(0).lat();var slng2 = linecopy2.getPath().getAt(0).lng();
            var elat2 = linecopy2.getPath().getAt(1).lng();var elng2 = linecopy1.getPath().getAt(1).lng();
            $.post('/lines',{slat:slat2,slng:slng2,elat:elat2,elng:elng2,tour_id:tour_id},function(){})
            lines[hoverPos].setMap(null);
            lines.splice(hoverPos,1,linecopy1,linecopy2);
            vertices.push(createVertex(linecopy1.getPath().getAt(1)));
            $.post('/vertices',{latitude:linecopy1.getPath().getAt(1).lat(),longitude:linecopy1.getPath().getAt(1).lng(),tour_id:tour_id},function(){})
            
            
          }
          circle.setMap(map);
          dragStart = false;
          map.setOptions({draggable: true});
        });
  //map listener to add marker
  //marker added to db here
   google.maps.event.addListener(map, 'click', function(event) {
        var marker = createMarker(event.latLng);
        $.post("/sites",{latitude:marker.getPosition().lat(),longitude: marker.getPosition().lng(),tour_id: tour_id },function(){  })
        if(markers.length > 1){
          var line = drawLine(markers[markers.length-2].position, event.latLng);
          lines.push(line);
          var slat = line.getPath().getAt(0).lat();var slng = line.getPath().getAt(0).lng();
          var elat = line.getPath().getAt(1).lat();var elng = line.getPath().getAt(1).lng();
          $.post('/lines',{slat:slat,slng:slng,elat:elat,elng:elng,tour_id:tour_id},function(){})
        }
          //everytime you click to add a marker, that line is drawn and saved to the db
    });
    for(var i = 0; i< msites.length; i++){
        var pos = new google.maps.LatLng(msites[i]['latitude'],msites[i]['longitude']);
        var m = createMarker(pos);   
    }
  //load saved lines from the db
    for(var i = 0; i<dblines.length; i++){
        var start = new google.maps.LatLng(dblines[i]['slat'],dblines[i]['slng']);
        var end = new google.maps.LatLng(dblines[i]['elat'],dblines[i]['elng']);
        lines.push(drawLine(start,end));    
    }
     for(var i = 0; i<dbvertices.length; i++){
        var pos = new google.maps.LatLng(dbvertices[i]['latitude'],dbvertices[i]['longitude']);
        vertices.push(createVertex(pos));    
    }
     for(var i = 0; i<dbhotspots.length; i++){
        var pos = new google.maps.LatLng(dbhotspots[i]['latitude'],dbhotspots[i]['longitude']);
        createPOI(pos);   
    }
}//end of initialize
 function createMarker(pos) {
        var marker = new google.maps.Marker({
          map: map,
          position: pos,
          zIndex: 3,
          draggable: true
        });
        markers.push(marker);
        var leftline;
        var rightline;
        //set wheel position
        //display site sources on the editor
        google.maps.event.addListener(marker, 'click', function(event) {
          wheel.setPosition(this.position);
          //clear the editor
          $("#sources").html("");
          $('#preview').html(" ");
          find_site(this);
          if(site_id != 0){
            display_site(site_id);
          }
        });
        google.maps.event.addListener(marker, 'dblclick', function(event) {
          infoWindow.setContent('<h2>New Landmark</h2><p>Current Lat: ' + this.getPosition().lat() + '<br>Current Long: ' + this.getPosition().lng() + ' </p><p>Drag me to adjust my position.</p>');
          infoWindow.open(map,this);
           
          })
        google.maps.event.addListener(marker, 'mouseover', function(event) {
          circle.setVisible(false);
        });
        google.maps.event.addListener(marker, 'mouseout', function(event) {
          circle.setVisible(true);
        });
        //handle database changes in here too
        google.maps.event.addListener(marker, 'dragstart', function(event) {
          wheel.setPosition(null);
          find_site(this);
          //redraw the line
          for(var i = 0; i < lines.length; i++){
            if(lines[i].getPath().getAt(0).lat() == this.getPosition().lat()){
               rightline = lines[i];
             }
             if(lines[i].getPath().getAt(1).lat() == this.getPosition().lat()){
              leftline = lines[i];
            }
          }
         });
        google.maps.event.addListener(marker, 'drag', function(event) {
            //remove the already drawn line before redrawing
           if(leftline){
            var path = [];
            path.push(leftline.getPath().getAt(0));
            path.push(event.latLng);
            leftline.setPath(path);
          }
          if(rightline){
            var path = [];
            path.push(event.latLng);
            path.push(rightline.getPath().getAt(1));
            rightline.setPath(path);
          }
        });
        google.maps.event.addListener(marker, 'dragend', function(event) {
            var new_lat = this.getPosition().lat();
            var new_lng = this.getPosition().lng();
            //get marker's original position
            //find out whether the original position was the lines start or end
            //ajax EDIT to database
           //redraw line here and save to db
           if(leftline){
            var edit_id = findLine(leftline);
            var slat = leftline.getPath().getAt(0).lat();var slng = leftline.getPath().getAt(0).lng();
            var elat = leftline.getPath().getAt(1).lat();var elng = leftline.getPath().getAt(1).lng();
            $.get('/lines/'+edit_id+'/edit',{slat:slat,slng:slng,elat:elat,elng:elng,tour_id:tour_id},function(){})
           }
           if(rightline){
            var edit_id = findLine(rightline);
            var slat = rightline.getPath().getAt(0).lat();var slng = rightline.getPath().getAt(0).lng();
            var elat = rightline.getPath().getAt(1).lat();var elng = rightline.getPath().getAt(1).lng();
            $.get('/lines/'+edit_id+'/edit',{slat:slat,slng:slng,elat:elat,elng:elng,tour_id:tour_id},function(){})
           }
           updateSite(site_id,new_lat,new_lng);
        });
        google.maps.event.addListener(marker, 'rightclick', function(event) {
         // $.post('/sites/'+site_id,{tour_id:tour_id},function(){});
         //DELETE ajax call
            deleteMarker(this);//delete from markers[]
        });
        return marker;
    }//end of create marker
//update marker coords in the markers array

//changes marker in db
function updateSite(site,lat,lng){
    $.get('/sites/'+site+'/edit',{latitude:lat,longitude:lng,tour_id:tour_id},function(){});
    //this ajax call will also change the contents of the #sites div 
}

function deleteMarker(m){
    var remove_id = find_site(m);
    $.post('/sites/'+remove_id,{_method:'delete'},function(){});
  for(var i =0; i < markers.length; i++){
    if(markers[i]==m){
      var pos = m.getPosition();
      m.setMap(null);
      markers.splice(i,1);
      var vertex = createVertex(pos);
      $.post("/vertices",{latitude:pos.lat(),longitude:pos.lng(),tour_id: tour_id },function(){  })
      vertices.push(vertex);
      break;
    }
  }
}

function deleteVertex(v){
  var ind = -1;
 for(var i = 0; i < lines.length; i++){
   if(lines[i].getPath().getAt(1).lat() == v.position.lat() &&
      lines[i].getPath().getAt(1).lng() == v.position.lng()){
     ind = i;
     break;
   }
 }
 var newline = drawLine(lines[ind].getPath().getAt(0),lines[ind+1].getPath().getAt(1));
 var remove_id1 = findLine(lines[ind]);
 $.post('/lines/'+remove_id1,{_method:'delete'},function(){}); //remove that line in db
 var remove_id2 = findLine(lines[ind+1]);
 $.post('/lines/'+remove_id2,{_method:'delete'},function(){}); //remove that line in db
 lines[ind].setMap(null);
 lines[ind+1].setMap(null);
 lines.splice(ind,2,newline);
 var slat = newLine.getPath().getAt(0).lat();var slng = newLine.getPath().getAt(0).lng();
 var elat = newLine.getPath().getAt(1).lat();var elng = newLine.getPath().getAt(1).lng();
 $.post('/lines',{slat:slat,slng:slng,elat:elat,elng:elng,tour_id:tour_id},function(){})

 for(var i = 0; i < vertexes.length; i++){
   if(vertexes[i] == v){
    var remove_id = findVertex(v);
    $.post('/vertices/'+remove_id,{_method:'delete'},function(){}); //remove that line in db
    v.setMap(null); 
    vertexes.splice(i,1);
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
    points = []
    points.push(start);
    points.push(end);
    var line = new google.maps.Polyline({
    map: map,
    icons: [{
      icon: lineSymbol,
      offset: '0',
      repeat: '4px'
    }],
    strokeColor: "#000000",
    strokeOpacity: 0.0,
    strokeWeight: 50,
    editable: false,
    zIndex: 1
  });
    line.setPath(points);
  google.maps.event.addListener(line, 'mousemove', function(event) {
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
          else{
            circle.setPosition(event.latLng);
            hoverLine = line;
          }
  });
  
  google.maps.event.addListener(line, 'mouseout', function(event) {
    circle.setPosition(null);
  });
  google.maps.event.addListener(line, 'mouseup', function(event) {
    if(dragging){
        var remove_id = findLine(lines[hoverPos]);
        dragging = false;
        var linecopy1 = drawLine(lineone.getPath().getAt(0), lineone.getPath().getAt(1));
        var linecopy2 = drawLine(linetwo.getPath().getAt(0), linetwo.getPath().getAt(1));
    
        lineone.setMap(null);
        linetwo.setMap(null);
        lines[hoverPos].setMap(null);
        lines.splice(hoverPos,1,linecopy1,linecopy2);
        var slat1 = linecopy1.getPath().getAt(0).lat();var slng1 = linecopy1.getPath().getAt(0).lng();
        var elat1 = linecopy1.getPath().getAt(1).lat();var elng1 = linecopy1.getPath().getAt(1).lng();
        $.post('/lines',{slat:slat1,slng:slng1,elat:elat1,elng:elng1,tour_id:tour_id},function(){})
        
        //add linetwo to db
        var slat2 = linecopy2.getPath().getAt(0).lat();var slng2 = linecopy2.getPath().getAt(0).lng();
        var elat2 = linecopy2.getPath().getAt(1).lat();var elng2 = linecopy2.getPath().getAt(1).lng();
        $.post('/lines',{slat:slat2,slng:slng2,elat:elat2,elng:elng2,tour_id:tour_id},function(){})
        $.post('/lines/'+remove_id,{_method:'delete'},function(){});
        vertices.push(createVertex(linecopy1.getPath().getAt(1)))
        $.post('/vertices',{latitude:linecopy1.getPath().getAt(1).lat(),longitude:linecopy1.getPath().getAt(1).lng(),tour_id:tour_id},function(){})
        
    }
    else{
        lineone.setMap(null);
        linetwo.setMap(null);
    }
        circle.setMap(map);
        dragStart = false;
        map.setOptions({draggable: true})
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
  var vertex_edit_id;
  google.maps.event.addListener(vertex, 'mouseover', function(event) {
    circle.setVisible(false);
  });
  google.maps.event.addListener(vertex, 'mouseout', function(event) {
    circle.setVisible(true);
  });
  google.maps.event.addListener(vertex, 'dragstart', function(event) {
    point = this.getPosition();
    vertex_edit_id = findVertex(vertex);
    for(var i = 0; i < lines.length; i++){
      if(lines[i].getPath().getAt(0).lat() == point.lat() &&
          lines[i].getPath().getAt(0).lng() == point.lng()){
        rightline = lines[i];
      }
      if(lines[i].getPath().getAt(1).lat() == point.lat() &&
          lines[i].getPath().getAt(1).lng() == point.lng()){
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
    //var vertex_edit_id = findVertex(vertex);
    if(leftline){
    var edit_id = findLine(leftline);
    var slat = leftline.getPath().getAt(0).lat();var slng = leftline.getPath().getAt(0).lng();
    var elat = leftline.getPath().getAt(1).lat();var elng = leftline.getPath().getAt(1).lng();
    $.get('/lines/'+edit_id+'/edit',{slat:slat,slng:slng,elat:elat,elng:elng,tour_id:tour_id},function(){})
    $.get('/vertices/'+vertex_edit_id+'/edit',{latitude:leftline.getPath().getAt(0).lat(),longitude:leftline.getPath().getAt(0).lng(),tour_id:tour_id},function(){})
    }
    if(rightline){
     var edit_id = findLine(rightline);
     var slat = rightline.getPath().getAt(0).lat();var slng = rightline.getPath().getAt(0).lng();
     var elat = rightline.getPath().getAt(1).lat();var elng = rightline.getPath().getAt(1).lng();
     $.get('/lines/'+edit_id+'/edit',{slat:slat,slng:slng,elat:elat,elng:elng,tour_id:tour_id},function(){})
     $.get('/vertices/'+vertex_edit_id+'/edit',{latitude:leftline.getPath().getAt(1).lat(),longitude:leftline.getPath().getAt(1).lng(),tour_id:tour_id},function(){})
    }
    
  });
  google.maps.event.addListener(vertex, 'dblclick', function(event) {
    convertToPOI(vertex);
  });
  google.maps.event.addListener(vertex, 'rightclick', function(event) {
    if(confirm('Delete this site?')){
      //delete vertex
    }
  });
  return vertex;
}

 //methods for editor drag and drop
 function add_photo_to_site(event, ui){
    var img = ui.draggable.find('img');
    var url = img.attr('src');
    $.post("/sources",{site_id: site_id, image: url},function(){
            
    })
 }
 /* Renders a site's information on the #sources panel
 *  id- the site's id reference in the db
*/
function display_site(id){
  $.get("/sites/"+id,function(){ })
}
 /* Renders a source's information(the description) on the #preview panel
 *  id- the source's id reference in the db
*/
function display_source(id){
  $.get("/sources/"+id,function(){ })
}
/* Finds the given marker's associate site from the db
 * sites- the database sites
 * marker - the clicked marker
*/
function find_site(marker){
    var s_id = 0;
  sites.find('.mark').each(function(){
    if(($(this).data('lat')==marker.getPosition().lat())&&($(this).data('lng')==marker.getPosition().lng())){
      site_div = $(this);
      site_id = $(this).data('mid');
      s_id = $(this).data('mid');
    }
  });
  return s_id;
}
/* Finds the given line's associate line from the db
 * lines- the database lines
 * line - the clicked line
*/
function findLine(line){
    var line_id = 0;
    var slat = line.getPath().getAt(0).lat();
    var slng = line.getPath().getAt(0).lng();
    var elat = line.getPath().getAt(1).lat();
    var elng = line.getPath().getAt(1).lng();
  lines2.find('.line').each(function(){
    if((($(this).data('slat')==slat)&&($(this).data('slng')==slng))||
       (($(this).data('elat')==elat)&&($(this).data('elng')==elng))){
      line_id = $(this).data('lid');
    }
  });
  return line_id;
}
//returns a vertex id from the database
function findVertex(vertex){
    var vertex_id = 0;
    var lat = vertex.position.lat();
    var lng = vertex.position.lng();
  vertices_div.find('.vertex').each(function(){
    if(($(this).data('latitude')==lat)&&($(this).data('longitude')==lng)){
      vertex_id = $(this).data('vid');
    }
  });
  return vertex_id;
}
//returns a vertex id from the database
function findHotspot(hotspot){
    var hotspot_id = 0;
    var lat = hotspot.position.lat();
    var lng = hotspot.position.lng();
  hotspots_div.find('.hotspot').each(function(){
    if(($(this).data('latitude')==lat)&&($(this).data('longitude')==lng)){
      hotspot_id = $(this).data('hid');
    }
  });
  return hotspot_id;
}
function convertToPOI(v){

  var pos = v.position;
  for(var i = 0; i < vertices.length; i++){
    if(vertices[i] == v){
      v.setMap(null);
      vertices.splice(i,1);
      break;
    }
  }
  //add poi to db
  $.post('/hotspots',{latitude:pos.lat(),longitude:pos.lng(),tour_id:tour_id},function(){})
  createPOI(pos);
}

/*
Create a point of interest at a given position
pos- the position of the point of interest
*/
function createPOI(pos){
  var poi = new google.maps.Marker({
    position: pos,
    map: map,
    icon: '/assets/binoculars.png',
    draggable: true
  });

  pois.push(poi);

  var rightline;
  var leftline;
  var hotspot_edit_id;
  //listeners
  google.maps.event.addListener(poi, 'mouseover', function(event) {
    circle.setVisible(false);
  });
  google.maps.event.addListener(poi, 'mouseout', function(event) {
    circle.setVisible(true);
  });
  google.maps.event.addListener(poi, 'dragstart', function(event) {
    hotspot_edit_id = findHotspot(poi);
    for(var i = 0; i < lines.length; i++){
      if(lines[i].getPath().getAt(0) == poi.position){
        rightline = lines[i];
      }
      if(lines[i].getPath().getAt(1) == poi.position){
        leftline = lines[i];
      }
    }
  });
  google.maps.event.addListener(poi, 'drag', function(event) {
    if(leftline){
      var path = [];
      path.push(leftline.getPath().getAt(0));
      path.push(event.latLng);
      leftline.setPath(path);
    }
    if(rightline){
      var path = [];
      path.push(event.latLng);
      path.push(rightline.getPath().getAt(1));
      rightline.setPath(path);
    }
  });
  google.maps.event.addListener(poi, 'dragend', function(event) {
    //var vertex_edit_id = findVertex(vertex);
    if(leftline){
    var edit_id = findLine(leftline);
    var slat = leftline.getPath().getAt(0).lat();var slng = leftline.getPath().getAt(0).lng();
    var elat = leftline.getPath().getAt(1).lat();var elng = leftline.getPath().getAt(1).lng();
    $.get('/lines/'+edit_id+'/edit',{slat:slat,slng:slng,elat:elat,elng:elng,tour_id:tour_id},function(){})
    $.get('/hotspots/'+hotspot_edit_id+'/edit',{latitude:leftline.getPath().getAt(0).lat(),longitude:leftline.getPath().getAt(0).lng(),tour_id:tour_id},function(){})
    }
    if(rightline){
     var edit_id = findLine(rightline);
     var slat = rightline.getPath().getAt(0).lat();var slng = rightline.getPath().getAt(0).lng();
     var elat = rightline.getPath().getAt(1).lat();var elng = rightline.getPath().getAt(1).lng();
     $.get('/lines/'+edit_id+'/edit',{slat:slat,slng:slng,elat:elat,elng:elng,tour_id:tour_id},function(){})
     $.get('/hotspots/'+hotspot_edit_id+'/edit',{latitude:leftline.getPath().getAt(1).lat(),longitude:leftline.getPath().getAt(1).lng(),tour_id:tour_id},function(){})
    }
    
  });
  google.maps.event.addListener(poi, 'rightclick', function(event) {
    if(confirm('Delete this point of interest?')){
      var pos = poi.position;
      
      for(var i = 0; i < pois.length; i++){
        if(pois[i] == poi){
            var remove_id = findHotspot(pois[i])
            $.post('/hotspots/'+remove_id,{_method:'delete'},function(){});
          poi.setMap(null);
          pois.splice(i,1);
          break;
        }
      }
      vertices.push(createVertex(pos));
      //add vertex to db
    }
  });
}
//Sets the selected line to be the line that has the same coords at the marker 


/* Will post the text editor's contents to the site's db
 *
*/
function save_description(){
    
}
$(document).ready(function(){
    tour_editor = true;
    sites = $("#sites");
    lines2 = $("#lines");
    
    
    initialize();
    hotspots_div = $('#hotspots');
    vertices_div = $('#vertices');
    $("#content_display").delegate('.photo','drag',function(e){
        $(this).draggable({
         helper: 'clone',
         cursor: 'move'
      })
      });
    $('#sources').droppable({
        accept: '.photo',
        drop: add_photo_to_site
    });
     $('#sources').delegate('.source', 'click', function() {
        selected_source = $(this).data('sid');
        var img = $(this).find('.source_image');
        var url = img.attr('src');
        $('#preview').html('<img src='+url+'>')
    });
    $('#sources').delegate('.source', 'dblclick', function() {
        selected_source = $(this).data('sid');
        display_source(selected_source);
    });
     $('#preview').delegate('#save_text','click',function(){
        var contents = tinymce.get('editor').getContent();
        if(source_editor && (selected_source != '0')){
        $.post('/descriptions',{source_id: selected_source, text: contents},function(){});
        }
        if(tour_editor){
            $.post('/descriptions',{tour_id: tour_id, text: contents},function(){});
        }
        if(site_editor){
            $.post('/descriptions',{site_id: site_id, text: contents},function(){});
        }
        //if the description is being updated and not initialized 
        if($('#editor').data('did')!=null){
            var did = $('#editor').data('did');
            alert(did);
            alert(contents);
            if(source_editor && (selected_source != '0')){
            $.get('/descriptions/'+did+'/edit',{source_id: selected_source, text: contents},function(){});
            }
            if(tour_editor){
                $.get('/descriptions/'+did+'/edit',{tour_id: tour_id, text: contents},function(){});
            }
            if(site_editor){
                $.get('/descriptions/'+did+'/edit',{site_id: site_id, text: contents},function(){});
            }
        }
     });
     $('#editPane').delegate('.site_description','click',function(){
        site_editor = true;
        tour_editor = false;
        source_editor = false;
        //set the inputed site 
     });
     $("#tour_description").click(function(){
        tour_editor = true;
        source_editor = false;
        site_editor = false;
     })
     $('#sources').delegate('.edit_icon','click',function(){
        source_editor = true;
        tour_editor = false;
        site_editor = false;
        //set the selected source
     })
    //$(document).delegate(tinymce.get('editor'),'blur',function(){
    //    var contents = tinymce.get('editor').getContent();
    //    if(source_editor && (selected_source != '0')){
    //    $.post('/descriptions',{source_id: selected_source, text: contents},function(){});
    //    }
    //    if(tour_editor){
    //        $.post('/descriptions',{tour_id: tour_id, text: contents},function(){});
    //    }
    //    if(site_editor){
    //        $.post('/descriptions',{site_id: site_id, text: contents},function(){});
    //    }
    //    //if the description is being updated and not initialized 
    //    if($('#editor').data('did')!=null){
    //        var did = $('#editor').data('did');
    //        if(source_editor && (selected_source != '0')){
    //        $.get('/descriptions/'+did+'/edit',{source_id: selected_source, text: tinymce.get('editor').getContent()},function(){});
    //        }
    //        if(tour_editor){
    //            $.get('/descriptions/'+did+'/edit',{tour_id: tour_id, text: tinymce.get('editor').getContent()},function(){});
    //        }
    //        if(site_editor){
    //            $.get('/descriptions/'+did+'/edit',{site_id: site_id, text: tinymce.get('editor').getContent()},function(){});
    //        }
    //    }
    // });
    
});
});