$(function(){

      /*
      The map object
      */
      var map;
     
      /*
      An array of all the markers on the map
      */
      var markers = [];

      /*
      An array of all the polylines on the map
      */
      var lines = [];
     
      /*
      An array of all the vertexes on the map
      */
      var vertexes = [];

      /*
      An array of all the points of interest on the map
      */
      var pois = [];

      /*
      The circle displayed when hovering over a polyline
      */
      var circle;
     
      /*
      Signifies if a site has been selected for content editing
      */
      var editMode = false;

      /*
      The visible line object being displayed over the invisible actual line
      */
      var lineSymbol;

      var overlay;
     
      /*
      The line most recently moused over
      */
      var hoverLine;

      /*
      Flag for if a circle has been clicked on, denotes the start of a line drag
      */
      var dragStart = false;

      /*
      Flag for if a line is being dragged currently
      */
      var dragging = false;

      /*
      One of the lines temporarily drawn during a drag
      */
      var lineone;
     
      /*
      One of the lines temporarily drawn during a drag
      */
      var linetwo;
     
      var hoverPos;
     
      /*
      An array of all the content objects for display on the editor
      */
      var contents = [];

      /*
      The content object currently on the editor
      */
      var curContent;

      var wheel;

      function initialize() {
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
            fillColor: "#FFFFFF",
            fillOpacity: 1.0
          },
          zIndex: 2,
          map: map
        });

        wheel = new google.maps.Marker({
          icon: {
            url: '/assets/wheel.gif',
            anchor: new google.maps.Point(30,40)
          },
          zIndex: 2,
          map: map,
          optimized: false
        });

        google.maps.event.addListener(circle, 'mousedown', function(event) {
          dragStart = true;
          circle.setMap(null);

          var pointone = hoverLine.getPath().getAt(0);
          var pointtwo = hoverLine.getPath().getAt(1);
          for(var i = 0; i < lines.length; i++){
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
            lines[hoverPos].setMap(null);
            lines.splice(hoverPos,1,linecopy1,linecopy2);
            createVertex(linecopy1.getPath().getAt(1));
          }
          circle.setMap(map);
          dragStart = false;
          map.setOptions({draggable: true});
        });
        google.maps.event.addListener(map, 'click', function(event) {
          createMarker(event.latLng);
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

        loadFromDB();

        //listener to preview sources on click
        $(document).on('click', '.source', function() {
          $('#preview').html("<img src='" + $(this).children('img').attr('src') + "' height='400' width='400'>");
        });
        //listener to delete sources on click
        $(document).on('click', '.remove', function(e) {
          e.stopPropagation();
          var srcdata = $(this).closest('.source').children('img').attr('src');
          removeSource(srcdata);
          $(this).closest('.source').remove();
        });
      }//end of initialize
      
      /*
      Save tour and all attributes to the database
      */
      function saveTour(){
        //save sites
        for( var i = 0; i < markers.length; i++ ){
          var lat = markers[i].getPosition().lat();
          var lng = markers[i].getPosition().lng();
          $.post("/sites",{longitude: lng, latitude:lat, tour_id: tour_id },function(){});
        }
        //save lines
        for( var i = 0; i < lines.length; i++ ){
          var slat = lines[i].getPath().getAt(0).lat();
          var slng = lines[i].getPath().getAt(0).lng();
          var elat = lines[i].getPath().getAt(1).lat();
          var elng = lines[i].getPath().getAt(1).lng();
          $.post("/lines",{slat: slat, slng: slng, elat: elat, elng: elng, tour_id: tour_id },function(){});
        }
        //save hotspots
        for( var i = 0; i < pois.length; i++ ){
          //:latitude, :longitude, :image, :text, :tour_id
          var lat = lines[i].getPosition().lat();
          var lng = lines[i].getPosition().lng();
          $.post("/lines",{latitude: lat, longitude: lng, tour_id: tour_id },function(){});
        }
         //save vertexes
        for( var i = 0; i < vertexes.length; i++ ){
          //:latitude, :longitude, :image, :text, :tour_id
          var lat = vertices[i].getPosition().lat();
          var lng = vertices[i].getPosition().lng();
          $.post("/vertices",{latitude: lat, longitude: lng, tour_id: tour_id },function(){});
        }
        
        //save sources
        for( var i = 0; i < contents.length; i++ ){
          var site_sources = contents[i];
          for( var i = 0; i < contents[i].imgs.length; i++ ){
            $.post("/sources",{site_id: getSiteId(site_sources), image: source.imgs[i]},function(){});
            //save 
            //$.post("/description",{source_id: source, text: source.texts[i]},function(){});
          }
            
        }
        
        
      }//end of saveTour()
    function clearTour(){
        for( var i = 0; i < dbsources.length; i++ ){
            $.post("/sources/"+dbsources[i]['id'],{ method: 'delete' },function(){});
          }
        for( var i = 0; i < dbdescriptions.length; i++ ){
            $.post("/descriptions/"+dbdescriptions[i]['id'],{ method: 'delete' },function(){});
        }
       for( var i = 0; i < dbsites.length; i++ ){
          $.post("/sites/"+dbsites[i]['id'], {method: 'delete' },function(){});
        }
        //save lines
        for( var i = 0; i < dblines.length; i++ ){
          $.post("/lines/"+dblines[i]['id'],{ method: 'delete' },function(){});
        }
        //save hotspots
        for( var i = 0; i < dbhotspots.length; i++ ){
          $.post("/hotspots/"+dbhotspots[i]['id'],{ method: 'delete' },function(){});
        }
         //save vertexes
        for( var i = 0; i < dbvertexes.length; i++ ){
          $.post("/vertices/"+dbvertexes[i]['id'],{ method: 'delete' },function(){});
        }
        
        
    }//end of clear tour

  /*
      Load markers, points of interest and lines from the database
      */
      function loadFromDB(){

        //load tour info first!

        for( var i = 0; i < dbsites.length; i++ ){
            var site;
          var pos = new google.maps.LatLng(dbsites[i]['latitude'],dbsites[i]['longitude']);
          var m = createMarker(pos);
          for(var j = 0; j < dbsources.length; j++){
           
            if(dbsources[j]['site_id'] == dbsites[i]['id']){
              var hasContent = false;
              for(var k = 0; k < contents.length; k++){
                if(contents[k].marker == m){
                  hasContent = true;
                  var hasDesc = false;
                  for(var q = 0; q < dbdescriptions.length; q++){
                    if(dbdescriptions[q]['source_id'] == dbsources[j]['id']){
                      hasDesc = true;
                      contents[k].txts.push(dbdescriptions['text']);
                      break;
                    }
                  }
                  contents[k].imgs.push(dbsources[j]['image']);
                  if(!hasDesc){
                    contents[k].txts.push('');
                  }
                  break;
                }
              }
              if(!hasContent){
                content = new Object();
                content.name = "";
                content.imgs = [];
                content.txts = [];
                content.marker = m;
                content.lat = m.position.lat();
                content.lng = m.position.lng();
                content.imgs.push(dbsources[j]['image']);
                var hasDesc = false;
                for(var q = 0; q < dbdescriptions.length; q++){
                  if(dbdescriptions[q]['source_id'] == dbsources[j]['id']){
                    hasDesc = true;
                    content.txts.push(dbdescriptions[q]['text']);
                    break;
                  }
                }
                contents.push(content);
              }
            }
          }
        }
      }//end of loadfromDB
      
      /*
      Delete a given marker from the tour and create a vertex where it was previously
      m - the marker being deleted
      */
      function deleteMarker(m){
        for(var i =0; i < markers.length; i++){
          if(markers[i] == m){
            var pos = m.position;
            deleteContent(m);
            m.setMap(null);
            markers.splice(i,1);
            createVertex(pos);
            break;
          }
        }
      }

      //update infowindow
      function setInfoWindow(m){
        // Set infowindow
        m['infowindow'] = new google.maps.InfoWindow({
          content: '<h2>New Landmark</h2><p>Current Lat: ' + m.position.lat() + '<br>Current Long: ' + m.position.lng() + ' </p><p>Drag me to adjust my position.</p>'
        });
      }

      /*
      Create a new marker at the given position
      pos - the position at which to create a new marker
      */
      function createMarker(pos) {
        var marker = new google.maps.Marker({
          map: map,
          position: pos,
          zIndex: 3,
          draggable: true
        });
        markers.push(marker);
        if(markers.length > 1){
          lines.push( drawLine(markers[markers.length-2].position, pos) );
        }

        loadToEditor(marker);

        var leftline;
        var rightline;

        google.maps.event.addListener(marker, 'click', function(event) {
          if(wheel.getPosition() != null){
            if(wheel.getPosition() == marker.position){
              clearEditor();
            }
            else{
              loadToEditor(marker);
            }
          }
          else{
            loadToEditor(marker);
          }
        });
        google.maps.event.addListener(marker, 'mouseover', function(event) {
          circle.setVisible(false);
        });
        google.maps.event.addListener(marker, 'mouseout', function(event) {
          circle.setVisible(true);
        });
        google.maps.event.addListener(marker, 'dragstart', function(event) {
          wheel.setPosition(null);
          for(var i = 0; i < lines.length; i++){
            if(lines[i].getPath().getAt(0) == marker.position){
               rightline = lines[i];
             }
             if(lines[i].getPath().getAt(1) == marker.position){
              leftline = lines[i];
            }
          }
         });
        google.maps.event.addListener(marker, 'drag', function(event) {
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
          loadToEditor(marker);
        });
        google.maps.event.addListener(marker, 'rightclick', function(event) {
          for(var i = 0; i < markers.length; i++){
            if(markers[i] == marker){
              if(i == 0){
                alert("Tour must have a starting point.  Cannot remove first site.");
                break;
              }
              else if(i == markers.length-1){
                alert("Tour must have an end point.  Cannot remove last site.");
                break;
              }
              else{
                if(confirm('Delete this site?')){
                  deleteMarker(marker);
                }
                break;
              }
            }
          }
        });
      }
    /*
    Returns the site_id to be associated with the content object
    content- the source content without a site_id
    */
    function getSiteId(marker){
      var lat = marker.getPosition().lat();
      var lng = marker.getPosition().lng();
      for(var i = 0; i< markers.length; i++){
        if(dbsites[i]['latitude']==lat && dbsites[i]['longitude']==lng){
            return dbsites[i]['id']
        
        }
      }
      return 0
    } 

      /*
      Display the contents for a marker in the editor.  If contents do not exist yet,
      create a new object to handle contents.
      m - the marker whose contents are being loaded
      */
      function loadToEditor(m) {
        var content;
        var hasContent = false;

        //clear current editor contents
        clearEditor();

        wheel.setPosition(m.position);

        //find contents
        for(var i = 0; i < contents.length; i++){
          if(contents[i].marker == m){
            content = contents[i];
            hasContent = true;
            break;
          }
        }

        //create contents if they do not exist yet
        if(!hasContent){
          content = new Object();
          content.name = "";
          content.imgs = [];
          content.txts = [];
          content.marker = m;
          contents.push(content);
        }

        content.lat = m.position.lat();
        content.lng = m.position.lng();

        //sets global content variable for adding and removing files dynamically
        curContent = content;

        //display contents on editor
        $("#siteName").value = content.name;
        $("#siteLatLng").text("Latitude: " + content.lat + " Longitude: " + content.lng);

        for(var i = 0; i < content.imgs.length; i++){
          addFileToSources(content.imgs[i]);
        }
      }

      /*
      Clear the displayed contents of the editor pane
      */
      function clearEditor() {
        wheel.setPosition(null);
        $("#siteLatLng").text("");
        $("#sources").children('.source').remove();
      }

      /*
      Deletes the content for a given marker
      m - the marker whose content is being deleted
      */
      function deleteContent(m) {
        clearEditor();
        for(var i =0; i < contents.length; i++){
          if(contents[i].marker == m){
            contents.splice(i, 1);
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
        var path = [];
        path.push(start);
        path.push(end);
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
        line.setPath(path);
        //listeners
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
            var projection = overlay.getProjection();
            var pixel = projection.fromLatLngToContainerPixel(event.latLng);
            hoverLine = line;
          }
        });

        google.maps.event.addListener(line, 'mouseout', function(event) {
          circle.setPosition(null);
        });
        google.maps.event.addListener(line, 'mouseup', function(event) {
          if(dragging){
            dragging = false;
            var linecopy1 = drawLine(lineone.getPath().getAt(0), lineone.getPath().getAt(1));
            var linecopy2 = drawLine(linetwo.getPath().getAt(0), linetwo.getPath().getAt(1));
            lineone.setMap(null);
            linetwo.setMap(null);
            lines[hoverPos].setMap(null);
            lines.splice(hoverPos,1,linecopy1,linecopy2);
            createVertex(linecopy1.getPath().getAt(1));
          }
          else{
            lineone.setMap(null);
            linetwo.setMap(null);
          }
          circle.setMap(map);
          dragStart = false;
          map.setOptions({draggable: true});
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
            fillColor: "#FF0000",
            fillOpacity: 0.5
          },
          draggable: true,
          position: pos,
          zIndex: 3,
          map: map
        });

        vertexes.push(vertex);

        var leftline;
        var rightline;

        google.maps.event.addListener(vertex, 'mouseover', function(event) {
          circle.setVisible(false);
        });
        google.maps.event.addListener(vertex, 'mouseout', function(event) {
          circle.setVisible(true);
        });
        google.maps.event.addListener(vertex, 'dragstart', function(event) {
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
        google.maps.event.addListener(vertex, 'dragend', function(event) {
        //vertex dragend listener
        });
        google.maps.event.addListener(vertex, 'rightclick', function(event) {
          deleteVertex(vertex);
          circle.setVisible(true);
        });
        google.maps.event.addListener(vertex, 'dblclick', function(event) {
          convertToPOI(vertex);
        });
      }

      /*
      Delete a given vertex and remove any attached lines, creating a new one
      between the next two nearest vertexes
      v - the vertex being deleted
      */
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
        lines[ind].setMap(null);
        lines[ind+1].setMap(null);
        lines.splice(ind,2,newline);

        for(var i = 0; i < vertexes.length; i++){
          if(vertexes[i] == v){
            v.setMap(null);
            vertexes.splice(i,1);
            break;
          }
        }
      }

      /*
      Convert a given vertex into a Point of Interest
      v - the vertex being converted
      */
      function convertToPOI(v){

        var pos = v.position;
        for(var i = 0; i < vertexes.length; i++){
          if(vertexes[i] == v){
            v.setMap(null);
            vertexes.splice(i,1);
            break;
          }
        }
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
        //listeners
        google.maps.event.addListener(poi, 'mouseover', function(event) {
          circle.setVisible(false);
        });
        google.maps.event.addListener(poi, 'mouseout', function(event) {
          circle.setVisible(true);
        });
        google.maps.event.addListener(poi, 'dragstart', function(event) {
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
        google.maps.event.addListener(poi, 'rightclick', function(event) {
          if(confirm('Delete this point of interest?')){
            var pos = poi.position;
            for(var i = 0; i < pois.length; i++){
              if(pois[i] == poi){
                poi.setMap(null);
                pois.splice(i,1);
                break;
              }
            }
            createVertex(pos);
          }
        });
      }

      /*
      get to file being dragged to add to the source list
      */
      function addFile(event, ui){
        var url = ui.draggable.attr('src');
        addFileToSources(url);
        //add the image source to the array of the current content
        curContent.imgs.push(url);
      }

      /*
      add a given file to the source list
      srcdata - the url of the file being added
      */
      function addFileToSources(srcdata){
        $('<div>', {class: 'source'}).html("<img src='" + srcdata + "' height='150' width='150'>").append(
            $('<div>', {class: 'remove'})).append($('<div>', {class: 'edit'})).appendTo($('#sources'));
      }

      /*
      remove a source from the current content
      srcdata - the source being removed
      */
      function removeSource(srcdata){
        var ind = -1;
        for(var i = 0; i < curContent.imgs.length; i++){
          if(curContent.imgs[i] == srcdata){
            ind = i;
            break;
          }
        }
        if(ind > -1){
          curContent.imgs.splice(ind, 1);
          curContent.txts.splice(ind, 1);
        }
      }

      $(document).ready(function(){
        initialize();
        $('.photo img').draggable({
          helper: 'clone',
        });
        $('#sources').droppable({
          accept: ".photo img",
          drop: addFile
        });
        //listener that calls saveTour()
        $('#save_tour').click(function(){
            clearTour();
            saveTour();
        })
        $('#sources').delegate('.source_image img', 'click', function() {
            $('#save_text').css('visibility','visible');
            var src = this.src;
            if(selected_source){
                $(selected_source).css('border','4px solid yellow')
            }
            $(this).css('border','4px solid green')
            selected_source = this;
            
            editor = false
            $('#preview').html('<img src='+src+'>')
        });
        //creates a new text editor inside the preview box
        //when the text image is clicked
        //makes the editor's save button visible 
        $('#sources').delegate('.edit', 'click', function() {
            $('#preview').tinymce({
                mode: 'exact',
                theme: 'advanced',
                entity_encoding: 'raw'
            });
            editor = true;
            var response =  $.get("/descriptions/4",function(){
                //hard-coded site_id for now, waiting for updated js file 
            }).success(function(){
                //ajax call was successful
             });
            //$('#preview').html(contents);
            $('#save_text').css('visibility','visible');
            editor = true;
        }); 
        //click listener for saving text to database
        $('#save_text').click(function(){
            //alert($('#preview').html());
            //current text in the text editor
            var contents = $('#preview').html();
            //check to see if contents are already there
            //ajax POST to descriptions from text editor
            
             $.post("/descriptions",{source_id: '4', text: contents},function(){
                //hard-coded site_id for now, waiting for updated js file 
              }).success(function(){
                //ajax call was successful
                alert("success!");
                });
        });
      });
});