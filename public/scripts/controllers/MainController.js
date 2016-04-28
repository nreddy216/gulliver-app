//=============================Main Controller==============================
'use strict';

var app = angular.module('GulliverApp');
app.controller('MainController', MainController);


//==============================================================================

MainController.$inject = ["Account"]; // minification protection
function MainController (Account) {
  var vm = this;

  vm.currentUser = function() {
   return Account.currentUser();
  }

}
