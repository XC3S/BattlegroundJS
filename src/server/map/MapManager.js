module.exports = mapManager;

var mapData = require('./MapMock')();

function mapManager(){
	
	var manager = {};	

	manager.getDummyField = function(){
		return {
			style: 0,
			collision: 0
		}
	};

	manager.getField = function(x,y){
		try {
			return mapData.fields[x][y];
		}
		catch(err){
			return manager.getDummyField();	
		}
	};

	manager.getChunk = function(x,y){
		var chunk = {};

		chunk.x = x;
		chunk.y = y;
		chunk.fields = [];

		for (var subx = 0; subx <= 9; subx++) {
			for (var suby = 0; suby <= 9; suby++) {
				var globalx = x * 10 + subx;
				var globaly = y * 10 + suby;

				var field = manager.getField(globalx,globaly);

				field.x = globalx;
				field.y = globaly;

				chunk.fields.push(field);
			};
		};

		return chunk;
	};

	return manager;
}