$(function(){
  var source = $("#folder_template").html();
  var template = Handlebars.compile(source);
  
  function retrieve(callback) {
    setTimeout(function() {
      callback.call();
    }, 500);
  }
    
  function show_folder(folder){
    var context = {
            folder_id: folder['id'],
            folder_name: folder['name']
          };
    $('#file_view').append(template(context));
  }

    $('.folder_link').click(function(){
        show_folder(folders[0]);
    });
});