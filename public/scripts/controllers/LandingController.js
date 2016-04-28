//=============================LandingController==============================
'use strict';

var app = angular.module('GulliverApp');
app.controller('LandingController', LandingController);


//==============================================================================
//THIS ISN'T USEFUL NOW - IF PARTICULAR STORY WILL BE SHOWCASED ON FRONT?
LandingController.$inject = ["$http", "Account", "$scope"]; // minification protection
function LandingController ($http, Account, $scope) {
  var vm = this;

  vm.currentUser = function() {
   return Account.currentUser();
  }

}
