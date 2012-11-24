
  var source = $("#folder_template").html();
  var template = Handlebars.compile(source);
  
  
  function retrieve(callback) {
    setTimeout(function() {
      callback.call();
    }, 500);
  }
  
  function init_listeners(){
    for(var i = 0; i < folders.length; i++){
        var id = folders[i]['id']
        var name = folders[i]['name'];
        $('#explorer').append("<div id ="+name+" class='fname'>"+name+"</div>");    
    }
    $('#explorer').find('.fname').each(function(key,value){
        $(this).click(function(){
           $(this).append("<div id = >");
        });
        
    });
  }
  function show_folder(folder){
    var context = {
            folder_id: folder['id'],
            folder_name: folder['name']
          };
          
    $('#file_view').append(template(context));
  }
 

