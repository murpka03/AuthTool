# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
jQuery ->
  $('#new_photo').fileupload
    dropzone :  $('#content_display')
    dataType: "script"
    add: (e, data) ->
      types = /(\.|\/)(gif|jpe?g|png|avi|mov)$/i
      file = data.files[0]
      if types.test(file.type) || types.test(file.name)
        data.context = file.name
        $('#new_photo').append(data.context)
        data.submit()
      else
        alert("#{file.name} is not a gif, jpeg, or png image file")