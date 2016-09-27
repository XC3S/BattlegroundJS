var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('underscore');

var gameInstance = require('./server/game/GameInstance')();
gameInstance.createGame();

// maybe use 
var tickTimeStamp = Date.now();

var chatManager = require('./server/chat/ChatManager');
var mapManager = require('./server/map/MapManager');

// run some test
//console.log("Test -> Map -> get item in range = ",mapManager().getField(1,2));
//console.log("Test -> Map -> get item out of range =",mapManager().getField(999999,999999));
//console.log("Test -> Chunk -> get chunk = ",mapManager().getChunk(1,2));

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
	});

	socket.emit('receive chunk',mapManager().getChunk(0,0));
});


// main game loop
// @TODO: replace intervall with a loop (maybe a skip frame feature)
setInterval(function(){
	var deltaTime = (Date.now() - tickTimeStamp) / 1000;
	tickTimeStamp = Date.now();
	
	processPlayerMovements(deltaTime);
	
	//io.sockets.clients().emit('update players', connectedPlayers);

	replicatePlayerInformations();
	replicateNearPlayers();
},16);


//inspiration: CrossCode 

function replicatePlayerInformations(){
	_.each(connectedPlayers,function(player){
		io.to(player.connectionId).emit("replicate player",player);
	});	
}

function replicateNearPlayers(){

}


// calculate movement 
function processPlayerMovements(deltaTime){
	_.each(connectedPlayers,function(player){
		// left & right
		if(!checkCollisionX(player.location.x, player.location.y, player.input.right, player.movement.speed * deltaTime, 5)){
			player.location.x += player.input.right * player.movement.speed * deltaTime; 
		}

		// top && down
		if(!checkCollisionY(player.location.x, player.location.y, player.input.top, player.movement.speed * deltaTime, 5)){
			player.location.y -= player.input.top * player.movement.speed * deltaTime;
		};	
	});
}

// false = blocked; true = free
function checkCollisionX(playerLocationX,playerLocationY,movementInput,travelDistance,playerCollisionRadius){
	if (movementInput > 0) { // right
		return mapManager().getFieldByLocation(playerLocationX + travelDistance + playerCollisionRadius,playerLocationY).collision;
	} 
	if (movementInput < 0) { // left
		return mapManager().getFieldByLocation(playerLocationX - travelDistance - playerCollisionRadius,playerLocationY).collision;
	}
	return false;
}

function checkCollisionY(playerLocationX,playerLocationY,movementInput,travelDistance,playerCollisionRadius){
	if (movementInput > 0) { // down
		return mapManager().getFieldByLocation(playerLocationX,playerLocationY + travelDistance - playerCollisionRadius).collision;
	} 
	if (movementInput < 0) { // up
		return mapManager().getFieldByLocation(playerLocationX,playerLocationY - travelDistance + playerCollisionRadius).collision;
	}
	return false;
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
			x: 550,
			y: 550
		},
		input: {
			top: 0,
			right: 0
		},
		movement: {
			speed: 30
		},
		connectionId: connectionId
	};

	connectedPlayers.push(player);
}