module.exports = animationManager();


function animationManager(){
	
	var manager = {};	
	var animtrees = [];

	(function init(){
		animtrees["ExamplePlayer"] = require("./animtrees/ExamplePlayerAnimTree");
		//... add all classes here 
	})();

	manager.determinePlayerAnimation = function(player){
		animtrees[player.class](player).updatePlayerAnimation();
	};

	return manager;
}