var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('underscore');

var gameInstance = require('./server/game/GameInstance')();
gameInstance.createGame();


var chatManager = require('./server/chat/ChatManager');


// host files
server.listen(3000,function(){
	console.log("server started");
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));


// manage connections

var connectedPlayers = [];

io.on('connection', function(socket){
	
	createPlayer(socket.id);
	console.log('a user connected',socket.id);
	console.log('connection count: ',connectedPlayers.length);

	socket.on('disconnect', function(){
		//clearInterval(interval);
		removePlayer(getPlayerByConnectionID(socket.id));

		console.log('user disconnected');
		console.log('connection count: ',connectedPlayers.length);
	});

	chatManager(io,socket);

	/*
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
	*/
	socket.on('update input', function(mov){
		getPlayerByConnectionID(socket.id).input.top = mov.top;
		getPlayerByConnectionID(socket.id).input.right = mov.right;
		
		console.log(getPlayerByConnectionID(socket.id).location);
	});
});

setInterval(function(){
	processPlayerMovements(0.01);
	//console.log(connectedPlayers);
	io.sockets.clients().emit('update players', connectedPlayers);
},16);

// manage players

function processPlayerMovements(deltaTime){
	_.each(connectedPlayers,function(player){
		//console.log(player.input.right,player.movement.speed,deltaTime);
		if (player.location.x >= 0 || player.input.right > 0) {
			player.location.x += player.input.right * player.movement.speed * deltaTime; 
		}
		player.location.y -= player.input.top * player.movement.speed * deltaTime; 
	});
}

function getPlayerByConnectionID(connectionId){
	return _.findWhere(connectedPlayers,{connectionId: connectionId});
}

function removePlayer(player){
	connectedPlayers = _.without(connectedPlayers,player);
}

function createPlayer(connectionId){
	var player =  {
		location: {
			x: 0,
			y: 0
		},
		input: {
			top: 0,
			right: 0
		},
		movement: {
			speed: 300
		},
		connectionId: connectionId
	};

	connectedPlayers.push(player);
}