module.exports = gameInstance;

function gameInstance(){
	
	var instance = {};	

	instance.createGame = function(){
		console.log("create game instance");
	}

	return instance;

}