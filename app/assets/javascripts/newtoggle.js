$('.btn-toggle').click(function() {
  $('#collapsable').slideToggle('slow', function() {
    // Animation complete.
  });
});