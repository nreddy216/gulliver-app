//-------------CREATE STORY CONTROLLER----------------------------------------

'use strict';

var app = angular.module('GulliverApp');
app.controller('CreateStoryController', CreateStoryController);

CreateStoryController.$inject = ["$http", "Account", "YourStoryService", "$scope"]; // minification protection
function CreateStoryController ($http, Account, YourStoryService, $scope) {

  var vm = this;

  //object where form data is stored
  vm.new_story = {};
  vm.storyId = "";
  vm.storyTitle = "";

  //edit form is hidden if edit is not clicked
  vm.displayPinForm = false;

  //create the initial story (saves to the DB) with only its title saved
  vm.createStory = function(){
    //posts to api/users/CURRENTUSERID/stories
    YourStoryService.save(vm.new_story, (function (response) {
        //add counter to pin data (will track the order of the pins)
        vm.pinCounter = 0;

        //save variables for later use with pins and editing form data
        vm.storyId = response._id;
        vm.storyTitle = response.title;

        //once submitted, the chapter form is shown
        vm.displayPinForm = true;

        //clears out new story after submit is pressed
        vm.new_story = {};
      }));
  }

  //marker data for the current story
  vm.new_location = {};
  vm.locations = []; //where all the marker data will be added
  vm.displayStoriesBtn = false;

  vm.submitLocationForm = function(){
    vm.geocode(vm.addPin); //calls geocode function to add the pin after it gets data from API
    vm.displayStoriesBtn = true; //once the title is submitted, the form for the markers/locations shows
  }

  //GET LOCATION FROM QUERY
  vm.geocode = function(addMapData) {
    //API call is in Backend
    //ajax call to get location data from the zipcode
     $http.get('/search/' + vm.new_location.locationName)
       .then(function(mapData) {
         var coordinates = mapData.data.features[0].center; //array [long, lat]
         addMapData(coordinates);// callback function that is called only after http call is receives data
       });
  }

  angular.extend($scope, {
      center: {
      },
      markers: {
      },
      defaults: {
        scrollWheelZoom: 'center', //zooms to the 'center'
        markerZoomAnimation: true, //zooms to whatever marker is rendered
        autoPan: true, //pans to whatever marker is clicked
        watch: true
      },
      layers: {baselayers: {
                       mapbox_light: { //Mapbox Streets is the default
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
    //sets the new_location properties of order, longitude, and latitude
    vm.new_location.pinOrder = vm.pinCounter;
    vm.new_location.longitude = coordinates[0];
    vm.new_location.latitude = coordinates[1];

    //each time a pin is added, a new center is rendered
    $scope.center = {
      lat: vm.new_location.latitude,
      lng: vm.new_location.longitude,
      zoom: 6
    }

    //this adds the marker to the map in the UI
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
