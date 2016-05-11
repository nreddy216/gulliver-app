//=============================ShowStoryController==============================
'use strict';

var app = angular.module('GulliverApp');
app.controller('ShowStoryController', ShowStoryController);


ShowStoryController.$inject = ["$http", "Account", "$scope", "Story", "$stateParams"];
function ShowStoryController ($http, Account, $scope, Story, $stateParams){
  var vm = this;

  vm.story = {};

  angular.extend($scope, {
      center: {
          lat: 0,
          lng: 0,
          zoom: 4
      },
      markers: {

      },
      defaults: {
        scrollWheelZoom: 'center',
        autoPan: true
      },
      layers: {baselayers: {
                       mapbox_light: {
                           name: 'Mapbox Streets',
                           url: 'https://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                           type: 'xyz',
                           layerOptions: {
                               apikey:  MAPBOX_API_TOKEN,
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

  //get specific user's story
  $http.get('/api/stories/' + $stateParams.id)
      .then(function (response) {

          //each story is the response
          vm.story = response.data;


          //goes through all story pins and sets them as default to false - they won't be seen

          vm.initializeCounter = function(){
            vm.story.pins.forEach(function(pin, index){
              if(index > 0){
                pin.activeChapter = false; //originally, only one of the pins will be showing
              } else {
                pin.activeChapter = true;

                var embeddedMessage = "";
                //if there's no image URL then it embeds only the text content
                if(pin.photoUrl){
                  embeddedMessage += "<img class='embedded-map-images' src='"+ pin.photoUrl + "'></img>";
                }

                embeddedMessage += "  " + pin.textContent;

                $scope.center = {
                  lat: pin.latitude,
                  lng: pin.longitude,
                  zoom: 6
                }

                 $scope.markers[pin.pinOrder] = {
                   lat: pin.latitude,
                   lng: pin.longitude,
                   message: embeddedMessage,
                   draggable: false,
                   focus: true
                }


              }

            });
          }

          //initializes count
          vm.initializeCounter();


          //keep track of each pin w/counter to see what to display
          vm.counter = 0;

          vm.showNextStory = function(){

            if(vm.counter > 0){
                vm.story.pins[vm.counter - 1].activeChapter = false;
              }

            if(vm.counter >= vm.story.pins.length - 1){
              vm.counter = 0;
              $scope.markers = {};
              vm.initializeCounter();
            } else {
              vm.counter = vm.counter + 1;
              console.log(vm.counter);
              vm.story.pins[vm.counter].activeChapter = true;

              var embeddedMessage = "";
              //if there's no image URL then it embeds only the text content
              if(vm.story.pins[vm.counter].photoUrl){
                embeddedMessage += "<img class='embedded-map-images' src='"+ vm.story.pins[vm.counter].photoUrl + "'></img>";
              }

              embeddedMessage += "  " + vm.story.pins[vm.counter].textContent;

                console.log(" PIN ", vm.story.pins[vm.counter]);
                 $scope.center = {
                   lat: vm.story.pins[vm.counter].latitude,
                   lng: vm.story.pins[vm.counter].longitude,
                   zoom: 4
                 }
                 $scope.markers[vm.story.pins[vm.counter].pinOrder] = {
                   lat: vm.story.pins[vm.counter].latitude,
                   lng: vm.story.pins[vm.counter].longitude,
                   message: embeddedMessage,
                   draggable: false,
                   focus: true
                }
              }
            }
          });
        }
