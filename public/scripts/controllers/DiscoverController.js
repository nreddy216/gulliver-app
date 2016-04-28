//=============================DiscoverController==============================
'use strict';

var app = angular.module('GulliverApp');
app.controller('DiscoverController', DiscoverController);


//==============================================================================
//Story is embedded as factory but not being used right now
DiscoverController.$inject = ["$http", "Account", "$scope"]; // minification protection
function DiscoverController ($http, Account, $scope) {
    var vm = this;
    vm.stories = []; //where all of user's stories will be stored

    //get specific user's stories
    $http.get('/api/stories')
        .then(function (response) {
          // vm.stories.push(response.data[0]);
          console.log(response.data);
          vm.stories = response.data;
        });


}
