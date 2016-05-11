//=============================DiscoverController==============================
'use strict';

var app = angular.module('GulliverApp');
app.controller('DiscoverController', DiscoverController);


//==============================================================================
//Allows users to view all the stories created on the application
DiscoverController.$inject = ["$http", "Account", "$scope", "StoryService"]; // minification protection
function DiscoverController ($http, Account, $scope, StoryService) {

    var vm = this;

    //uses $resource to query all stories in api/stories
    StoryService.query(function(response){
      //where all of users' stories will be stored
      vm.stories = response;
    });

}
