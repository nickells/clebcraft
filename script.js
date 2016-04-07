function getInfo(query, http){
  if (!http) throw new Error('this isn\'t the http you\'re looking for')
  return http.get('http://mcapi.ca/query/clebcraft.eastus2.cloudapp.azure.com/' + query)
  .then(function(res){
    return res.data;
  })
  .catch(function(res){
    console.log(res);
  })
}

var app = angular.module('ClebCraftApp', []);

app.controller('MainCtrl', function($scope,$http,$interval){
  //initialize players array
  $scope.loading = true;

  pollServer();
  $interval(pollServer,10000)

  function pollServer(){
    getInfo('list',$http)
    .then(function(data){
      var players = [];
      if (data.Players.list){
        players = data.Players.list.map(function(playerName){
          return {
            name: playerName,
            avatar: 'http://minotar.net/avatar/' + playerName + '/160'
          }
        });
      }
      $scope.players = players;
      $scope.loading = false;
    })
    .catch(console.log)

    getInfo('info',$http)
    .then(function(data){
      if (data.status){
        $scope.serverData = data;
        $scope.playersInfo = data.players;
      }
      else throw new Error('error from get info',data)
    })
    .catch(console.log)  
  }
})

