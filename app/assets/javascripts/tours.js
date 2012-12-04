$(function(){
var map;
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
var markers = [];
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
  //load saved sites to map from the db
  for(var i = 0; i< msites.length; i++){
    var pos = new google.maps.LatLng(msites[i]['latitude'],msites[i]['longitude']);
    var m = createMarker(pos);
    m.setMap(map);
    
  }
  //load saved lines from the db
  for(var i = 0; i < dblines.length; i++){
    var start = new google.maps.LatLng(dblines[i]['slat'],dblines[i]['slng']);
    var end = new google.maps.LatLng(dblines[i]['elat'],dblines[i]['elng']);
    var l = drawLine(start,end,map);
  }

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
    hovertemp = hoverLine;
    
    lineone = drawLine(pointone, event.latLng,map);
    linetwo = drawLine(event.latLng, pointtwo,map);
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
            var linecopy1 = drawLine(lineone.getPath().getAt(0), lineone.getPath().getAt(1),map);
            var linecopy2 = drawLine(linetwo.getPath().getAt(0), linetwo.getPath().getAt(1),map);
            lineone.setMap(null);
            linetwo.setMap(null);
            lines[hoverPos].setMap(null);
            lines.splice(hoverPos,1,linecopy1,linecopy2);
            createVertex(linecopy1.getPath().getAt(1));
          }
          circle.setMap(map);
          dragStart = false;
          map.setOptions({draggable: true});
        });
  //map listener to add marker
  //marker added to db here
   google.maps.event.addListener(map, 'click', function(event) {
        var marker = createMarker(event.latLng);
        marker.setMap(this);
        $.post("/sites",{latitude:marker.getPosition().lat(),longitude: marker.getPosition().lng(),tour_id: tour_id },function(){  })
          //everytime you click to add a marker, that line is drawn and saved to the db
        if(markers.length > 1){
          var line = drawLine(markers[markers.length-2].position, event.latLng,map);
          var slat = line.getPath().getAt(0).lat();
          var slng = line.getPath().getAt(0).lng();
          var elat = line.getPath().getAt(1).lat();
          var elng = line.getPath().getAt(1).lng();
          $.post('/lines',{slat:slat,slng:slng,elat:elat,elng:elng,tour_id:tour_id},function(){})
        }
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
}//end of initialize
 function createMarker(pos) {
        var marker = new google.maps.Marker({
          position: pos,
          zIndex: 3,
          draggable: true
        });
        markers.push(marker);
        var line_start;
        var leftline;
        var rightline;
        //set wheel position
        //display site sources on the editor
        google.maps.event.addListener(marker, 'click', function(event) {
            drawn = true;
          wheel.setPosition(this.position);
          //clear the editor
          $("#sources").html("");
          $('#preview').html(" ");
          find_site(this);
          site_lines = findMarkerLines(this);
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
          //redraw the line
            drawn = true;
          for(var i = 0; i < lines.length; i++){
            if(lines[i].getPath().getAt(0) == this.position){
               rightline = lines[i];
             }
             if(lines[i].getPath().getAt(1) == this.position){
              leftline = lines[i];
            }
          }
         });
        google.maps.event.addListener(marker, 'drag', function(event) {
            //remove the already drawn line before redrawing
        var marker_move = this.position;
        
          for(var i = 0; i< site_lines.length; i++){
            var line = site_lines[i];
            var id = line[1];
            if(line[0]=="start"){
                var elat = line[2].data('elat')
                var elng = line[2].data('elng');
                var p = new google.maps.LatLng(elat,elng);
                if(drawn){
                    drawn.setMap(null);
                    drawn = drawLine(marker_move,p,map);
                    }
                else{drawn = drawLine(marker_move,p,map)}
            }
            if(line[0]=="end"){
                var slat = line[2].data('slat');
                var slng = line[2].data('slng');
                var p = new google.maps.LatLng(slat,slng);
                if(drawn){
                    drawn.setMap(null);
                    drawn = drawLine(p,marker_move,map);
                }
                else{drawn = drawLine(p,marker_move,map);}
            }
          }
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
            for(var i = 0; i< site_lines.length; i++){
                var line = site_lines[i];
                if(line[0]=="start"){
                    updateLine(line[1],new_lat,new_lng,"start");
                }
                if(line[0]=="end"){
                    updateLine(line[1],new_lat,new_lng,"end");
                }
            }
            updateSite(site_id,new_lat,new_lng);//ajax EDIT to database
           //redraw line here and save to db
           
           
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
//returns the google line
function updateLine(line,lat,lng,startend){
    //for(var i = 0; i<lines.length;i++){
    //    var tmp = lines[i];
    //    var slat = tmp.getPath().getAt(0).lat();
    //    var slng = tmp.getPath().getAt(0).lng();
    //    var elat = tmp.getPath().getAt(1).lat();
    //    var elng = tmp.getPath().getAt(1).lng();
    //    if()
    //}
    
    if(startend=="start"){
    $.get('/lines/'+line+'/edit/',{slat:lat,slng:lng,tour_id:tour_id},function(){});
    }
    if(startend=="end"){
    $.get('/lines/'+line+'/edit/',{elat:lat,elng:lng,tour_id:tour_id},function(){});
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
function drawLine(start, end,map ) {
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
    strokeOpacity: 0.0,
    strokeWeight: 50,
    editable: false,
    zIndex: 1
  });
    line.setPath(points);
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

$("#save_tour").click(function(){
    alert("Tour was saved!");
});
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
  sites.find('.mark').each(function(){
    if(($(this).data('lat')==marker.getPosition().lat())&&($(this).data('lng')==marker.getPosition().lng())){
      site_div = $(this);
      site_id = $(this).data('mid');
    }
  });
}
//Sets the selected line to be the line that has the same coords at the marker 
function findMarkerLines(marker){
    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
    var marker_lines = []
    lines2.find('.line').each(function(){
        var line = [] 
    if(($(this).data('slat')==lat)&&($(this).data('slng')==lng)){
        line.push("start"); //the marker is a starting point for the line
        line.push($(this).data('lid'));
        line.push($(this));
        marker_lines.push(line);
    }
    if(($(this).data('elat')==lat)&&($(this).data('elng')==lng)){
        line.push("end"); //the marker is a starting point for the line
        line.push($(this).data('lid'));
        line.push($(this));
        marker_lines.push(line);
    }
    });
    return marker_lines;
}
/* Finds the given line's associate line from the db
 * lines- the database lines
 * line - the clicked line
*/
function findByLine(line){
    var slat = line.getPath().getAt(0).lat();
    var slng = line.getPath().getAt(0).lng();
    var elat = line.getPath().getAt(1).lat();
    var elng = line.getPath().getAt(1).lng();
  lines2.find('.line').each(function(){
    if((($(this).data('slat')==slat)&&($(this).data('slng')==slng))||
       (($(this).data('elat')==elat)&&($(this).data('elng')==elng))){
      line_div = $(this);
      line_id = $(this).data('lid');
    }
  });
}
/* Will post the text editor's contents to the site's db
 *
*/
function save_description(){
    
}
$(document).ready(function(){
    sites = $("#sites");
    lines2 = $("#lines");
    initialize();
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
        //is this for a site, source, or tour?
        //if(selected_source != '0'){
        //    $.post('/descriptions',{source_id: selected_source, text: contents},function(){});
        //}
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
     $(document).delegate(tinymce.get('editor'),'blur',function(){
        var contents = tinymce.get('editor').getContent();
        //check to see that the editor has content
        //if(contents != ""){
        //    //save to database
        //    if(source_editor && (selected_source != '0')){
        //    $.post('/descriptions',{source_id: selected_source, text: contents},function(){});
        //    }
        //    if(tour_editor){
        //        $.post('/descriptions',{tour_id: tour_id, text: contents},function(){});
        //    }
        //    if(site_editor){
        //        $.post('/descriptions',{site_id: site_id, text: contents},function(){});
        //    }
        //}
     });
    
});
});