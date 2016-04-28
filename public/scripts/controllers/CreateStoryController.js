//-------------CREATE STORY CONTROLLER----------------------------------------

'use strict';

var app = angular.module('GulliverApp');
app.controller('CreateStoryController', CreateStoryController);

CreateStoryController.$inject = ["$http", "Account", "Story", "$scope", "Pin"]; // minification protection
function CreateStoryController ($http, Account, Story, $scope, Pin) {
  var vm = this;
  vm.stories = []; //where all of user's stories will be stored
  vm.new_story = {}; //form data
  vm.storyId = "";
  vm.storyTitle = "";
  vm.currentStory = {};
  vm.pinCounter = 0;

  vm.new_location = {};
  vm.locations = [];

  vm.displayPinForm = false;

  vm.createStory = function(){
    console.log("create story: ", vm.new_story);
    $http.post('/api/users/' + Account.currentUser()._id + '/stories', vm.new_story)
      .then(function (response) {
        vm.pinCounter = 0; //add counter to pin data
        console.log(" STORY new ", vm.new_story);
        vm.new_story = {};
        vm.storyId = response.data._id; //get id so that pins can be added to this story
        vm.storyTitle = response.data.title;
        vm.storyImage = response.data.imageUrl;
        vm.currentStory = response.data;
        vm.stories.push(response.data);
        vm.displayPinForm = true;
      });

  }


  vm.new_location = {};
  vm.displayStoriesBtn = false;

  vm.submitLocationForm = function(){
    vm.geocode(vm.addPin);
    vm.displayStoriesBtn = true;
  }

  //GET LOCATION FROM QUERY
  vm.geocode = function(addMapData) {
    //api from mapbox with access token
    var apiEndpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+vm.new_location.locationName+'.json?access_token=pk.eyJ1IjoibnJlZGR5MjE2IiwiYSI6ImNpbW1vdWg2cjAwNTN2cmtyMzUzYjgxdW0ifQ.NeWvItiiylXClGSqlXUNsg&autocomplete=true'

   //ajax call to get location data from the zipcode
   $http.get(apiEndpoint)
     .then(function(mapData) {
       var coordinates = mapData.data.features[0].center; //array [long, lat]
       console.log("vm.location.locationName", vm.new_location.locationName);
       console.log(apiEndpoint);
       console.log("res map", mapData);
       addMapData(coordinates);// callback function that is called only after http call is receives data
     })
  }

  angular.extend($scope, {
      //originally sets map in london
      center: {
      },
      markers: {
      },
      defaults: {
        // minZoom: 2,
        // doubleClickZoom: true,
        scrollWheelZoom: 'center', //zooms to the 'center'
        markerZoomAnimation: true, //zooms to whatever marker is rendered
        autoPan: true, //pans to whatever marker is clicked
        watch: true
      },
      layers: {baselayers: {
                       mapbox_light: {
                           name: 'Mapbox Streets',
                           url: 'https://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                           type: 'xyz',
                           layerOptions: {
                               apikey: 'pk.eyJ1IjoibnJlZGR5MjE2IiwiYSI6ImNpbW1vdWg2cjAwNTN2cmtyMzUzYjgxdW0ifQ.NeWvItiiylXClGSqlXUNsg',
                               mapid: 'mapbox.streets'
                           }
                       },
                       osm: {
                          name: 'OpenStreetMap',
                          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                          type: 'xyz'
                      }
                  }
                }
  });



   //adding pin
  vm.addPin = function(coordinates){
    vm.pinCounter += 1;
    vm.new_location.pinOrder = vm.pinCounter;
    vm.new_location.longitude = coordinates[0];
    vm.new_location.latitude = coordinates[1];

    $scope.center = {
      lat: vm.new_location.latitude,
      lng: vm.new_location.longitude,
      zoom: 6
    }


    $scope.markers[vm.pinCounter] = {
      lat: vm.new_location.latitude,
      lng: vm.new_location.longitude,
      message: vm.new_location.textContent,
      draggable: false,
      focus: true,
      riseOnHover: true

    }

     $http.post('/api/stories/' + vm.storyId + '/pins', vm.new_location)
       .then(function(data) {
         vm.locations.push(data);
         vm.new_location = {};
         console.log("location info vm locations !!!! ", vm.locations);
     });

  }

  vm.pins = []; //where all of user's chapters/pins will be stored

  //get specific user's stories
  $http.get('/api/stories/' + vm.storyId + '/pins')
      .then(function (response) {
        vm.pins.push(response.data);
      });

  //update chapter / pin
  vm.displayEditPinForm = false; //set displayEditForm to false initially
  vm.updatePin = function(pin){
    // console.log(" HUH ", pin);
    $http.put('/api/pins/' + pin._id, pin).then(function(response) {
        vm.displayEditPinForm = false; //set back to false after edit
      });
  }

  //update story title
  vm.displayEditTitleForm = false; //set displayEditForm to false initially
  vm.updateTitle = function(story){
    console.log(story);
    var updated_title = {
      title: story
    }
    $http.put('/api/stories/' + vm.storyId, updated_title).then(function(response) {
        console.log(response);
        vm.displayEditTitleForm = false; //set back to false after edit
      });
  }

  //delete chapter / pin
  vm.deletePin = function(pin){
    $http.delete('/api/pins/' + pin._id).then(function(response) {
        var pinIndex = vm.locations.indexOf(pin);
        vm.locations.splice(pinIndex, 1);
        //delete pin from markers (from map)
        delete $scope.markers[pin.pinOrder];
      });
  }
};
//==============================================================================
