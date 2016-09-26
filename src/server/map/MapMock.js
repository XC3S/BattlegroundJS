module.exports = mapMock;


function createField(styleID,collision){
	return {
		style: styleID,
		collision: collision
	}
}

function mapMock(){
	var map = {};

	var mapSize = 100;

	map.fields = new Array(mapSize).fill(0).map(row => new Array(mapSize).fill(0))

	for (x = 0; x < mapSize; x++) { 
		for (y = 0; y < mapSize; y++) { 
			map.fields[x][y] = createField(1,0);
		}
	}

	map.fields[3][3] = createField(2,1);
	map.fields[3][4] = createField(2,1);

	return map;
}