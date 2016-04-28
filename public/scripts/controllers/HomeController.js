//=============================HomeController=================================
'use strict';

var app = angular.module('GulliverApp');
app.controller('HomeController', HomeController);

//Story is embedded as factory but not being used right now
HomeController.$inject = ["$http", "Account", "Story", "$scope"]; // minification protection
function HomeController ($http, Account, Story, $scope) {
    var vm = this;
    vm.stories = []; //where all of user's stories will be stored
    vm.new_story = {}; //form data

    console.log(Account.currentUser());

    //get specific user's stories
    $http.get('/api/users/'+ Account.currentUser()._id +'/stories')
        .then(function (response) {
          // vm.stories.push(response.data[0]);
          // console.log(response.data);
          vm.stories = response.data;
        });

    ///delete story from home page
    vm.deleteStory = function(story){
      console.log(vm.stories);
      $http.delete('/api/stories/' + story._id).then(function(response) {
          //delete story from front view by getting the index in the array and splicing
          var storyIndex = vm.stories.indexOf(story);
          vm.stories.splice(storyIndex, 1);
        });
    }
}
