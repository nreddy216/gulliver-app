//-------------CREATE STORY CONTROLLER----------------------------------------

'use strict';

var app = angular.module('GulliverApp');


app.controller('CreateStoryController', CreateStoryController);

CreateStoryController.$inject = ["$http", "Account", "YourStoryService", "$scope"]; // minification protection
function CreateStoryController ($http, Account, YourStoryService, $scope) {
  var vm = this;
  vm.new_story = {}; //object where form data is stored
  vm.storyId = ""; //the id of the story in api/stories
  vm.storyTitle = ""; //the title of the story

  vm.displayPinForm = false; //edit form is hidden if edit is not clicked

  //create the initial story with only its title
  vm.createStory = function(){
    //YourStoryService accesses api/users/CURRENTUSERID/stories
    YourStoryService.save(vm.new_story, (function (response) {
        vm.pinCounter = 0; //add counter to pin data (tracks the order of the pins)
        vm.storyId = response._id;
        vm.storyTitle = response.title;
        vm.displayPinForm = true;
        vm.new_story = {}; //clears out new story after submit is pressed
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
    //get MAPBOX API with access token (in hidden file)
    var apiEndpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+vm.new_location.locationName+'.json?access_token=' + MAPBOX_API_TOKEN + '&autocomplete=true'

    //ajax call to get location data from the zipcode
     $http.get(apiEndpoint)
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
        // minZoom: 2,
        // doubleClickZoom: true,
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
                               apikey: MAPBOX_API_TOKEN,
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
