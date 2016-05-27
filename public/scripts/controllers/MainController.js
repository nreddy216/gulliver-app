//=============================Main Controller==============================
'use strict';

var app = angular.module('GulliverApp');
app.controller('MainController', MainController);


//==============================================================================

MainController.$inject = ["Account", "TokenFactory", "$scope"]; // minification protection
function MainController (Account, TokenFactory, $scope) {
  var vm = this;

  console.log("HI");

  vm.currentUser = function() {
   return Account.currentUser();
  }

  // $scope.mapbox_token = TokenFactory.getMapboxToken();

  $scope.mapbox_token = TokenFactory.getMapboxToken().then(function(response){

      return response.data;


  }).catch(function(error) {
      return error;
  });

  console.log($scope.mapbox_token);






}
