var mapController = function($scope,$socket){
  $scope.chunks = []
  
  $socket.on('receive chunk', function(chunk){
    //$scope.players = connectedPlayers;
    console.log("receive chunk @ map :", chunk);

    //@TODO: check if its already saved or something
    $scope.chunks.push(chunk);
  });
}

battleApp.controller('mapController',mapController);
mapController.$inject = ['$scope','$socket'];