var socket = io();
var params = jQuery.deparam(window.location.search);

socket.on('connect', function () {
   console.log('Connected to server');
   

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  // console.log('newMessage', message);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: params.name,
    to : "everyone",
    text: jQuery('[name=message]').val()
  }, function () {
      console.log(jQuery('[name=message]').val());
  });
});
