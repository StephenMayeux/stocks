$(document).ready(function() {
  var socket = io();
  var counter = 0;

  $('#get-quote').on('click', function() {
    counter++;
    socket.emit('send quote', counter);
  });

  socket.on('new quote', function(data) {
    $('#quotes').append('<li class="list-group-item list-group-item-success list-inline">' + data.num + data.farts + '</li>');
  });

});
