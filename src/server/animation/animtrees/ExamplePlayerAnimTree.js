module.exports = animtree;

var _ = require('underscore');

function animtree(player){

	var tree = {};

	tree.defaultState = "stay"
	
	tree.states = [{
		name: "stay",
		animation: {
			Down: "/Down/Down1.png",
			Up: "/Up/Up1.png",
			Left: "/Left/Left1.png",
			Right: "/Right/Right1.png",
			LeftDown: "/LeftDown/LeftDown1.png",
			RightDown: "/RightDown/RightDown1.png",
			LeftUp: "/LeftUp/LeftUp1.png",
			RightUp: "/RightUp/RightUp1.png"	
		},
		transitions:[{
			target: "move",
			condition: function(){
				return player.input.top != 0 || player.input.right != 0;
			}
		}]
	},{
		name: "move",
		animation: {
			Down: "/Down/Down.gif",
			Up: "/Up/Up.gif",
			Left: "/Left/Left.gif",
			Right: "/Right/Right.gif",
			LeftDown: "/LeftDown/LeftDown.gif",
			RightDown: "/RightDown/RightDown.gif",
			LeftUp: "/LeftUp/LeftUp.gif",
			RightUp: "/RightUp/RightUp.gif"	
		},
		transitions: [{
			target: "stay",
			condition: function(){
				return player.input.top == 0 && player.input.right == 0;
			}
		}]
	}];

	// @TODO: determine the default location with a default flag
	// move the updatePlayerAnimation Function to a generic script (this is only configuration)

	tree.updatePlayerAnimation = function(){
		if(!player.animation){
			//default animation
			player.animation = {
				state: tree.defaultState,
				animation: "/Down/Down1.png",
				direction: tree.determineDirection()	
			};
		}

		// udate current state 
		var currentState = _.find(tree.states,function(state){
			return state.name == player.animation.state;
		});

		if(currentState){
			var nextState = _.find(currentState.transitions, function(transition){
				return transition.condition()
			});

			if (nextState){
				player.animation.state = nextState.target;
				
			}	
		}
		player.animation.direction = tree.determineDirection();
		player.animation.animation = _.find(tree.states,function(state){
			return state.name == player.animation.state;
		}).animation[player.animation.direction];
	};

	tree.determineDirection = function(){
		if (player.input.top > 0 && player.input.right > 0){
			return "RightUp";
		}
		else if (player.input.top > 0 && player.input.right < 0){
			return "LeftUp";
		}
		else if (player.input.top > 0 && player.input.right == 0){
			return "Up";
		}
		else if (player.input.top < 0 && player.input.right > 0){
			return "RightDown";
		}
		else if (player.input.top < 0 && player.input.right == 0){
			return "Down";	
		}
		else if (player.input.top < 0 && player.input.right < 0){
			return "LeftDown";
		}
		else if (player.input.top == 0 && player.input.right > 0){
			return "Right";
		}
		else if (player.input.top == 0 && player.input.right < 0){
			return "Left";
		}
		else {
			try {
				return player.animation.direction;
			}
			catch(e){
				return "Down" // Default Dircetion
			}
			
		}

	};

	return tree;
}