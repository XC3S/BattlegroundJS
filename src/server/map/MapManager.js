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
		
	};

	return manager;
}