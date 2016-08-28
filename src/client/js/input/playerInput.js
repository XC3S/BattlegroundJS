var playerInput = function(){
	var public = this;
	var private = [];
	private.updateCallback = null;

	public.movement = {
		top: 0,
		right: 0
	};

	public.initListeners = function(callback){
		private.updateCallback = callback;
		window.addEventListener("keydown", private.onKeyDown, false);
		window.addEventListener("keyup", private.onKeyUp, false);
	};

	private.onKeyDown = function(event) {
		var keyCode = event.keyCode;
		switch (keyCode) {
			case 68: //d
				public.movement.right = 1;
				private.updateCallback();
				break;
			case 83: //s
				public.movement.top = -1;
				private.updateCallback();
				break;
			case 65: //a
				public.movement.right = -1;
				private.updateCallback();
				break;
			case 87: //w
				public.movement.top = 1;
				private.updateCallback();
				break;
		}
	};

	private.onKeyUp = function(event) {
		var keyCode = event.keyCode;
		switch (keyCode) {
			case 68: //d
				public.movement.right = 0;
				private.updateCallback();
				break;
			case 83: //s
				public.movement.top = 0;
				private.updateCallback();
				break;
			case 65: //a
				public.movement.right = 0;
				private.updateCallback();
				break;
			case 87: //w
				public.movement.top = 0;
				private.updateCallback();
				break;
		}
	};

	return public;
};