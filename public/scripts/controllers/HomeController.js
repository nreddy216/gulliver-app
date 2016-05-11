//=============================HomeController=================================
'use strict';

var app = angular.module('GulliverApp');
app.controller('HomeController', HomeController);

//Story is embedded as factory but not being used right now
HomeController.$inject = ["$http", "Account", "StoryService", "YourStoryService", "$scope"]; // minification protection
function HomeController ($http, Account, StoryService, YourStoryService, $scope) {
    var vm = this;

    //get specific user's stories
    YourStoryService.query(function(response){
      //where all of user's stories will be stored
      vm.stories = response;
    });

    ///delete story from user's home page
    vm.deleteStory = function(story){
      //deletes story from database
      StoryService.delete({id: story._id});

      //removes story from UI after click
      var storyIndex = vm.stories.indexOf(story);
      vm.stories.splice(storyIndex, 1);
    }


}
