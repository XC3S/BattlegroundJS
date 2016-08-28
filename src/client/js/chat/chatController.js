var chatController = function($scope,$socket){
  $('form').submit(function(){
    $socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  $socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
}

battleApp.controller('chatController',chatController);
chatController.$inject = ['$scope','$socket'];