/*
var socket = io();

$('form').submit(function(){
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
	return false;
});

socket.on('chat message', function(msg){
	$('#messages').append($('<li>').text(msg));
});

socket.on('tick',function(){
	console.log("ticked");
});


var pi = new playerInput();
pi.initListeners(function(){
	socket.emit('update input',pi.movement);
});
*/