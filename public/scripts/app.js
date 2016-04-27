//==============================================================================

////////////
// SETUP //
////////////

//==============================================================================

var app = angular
  .module('GulliverApp', [
    'ui.router', 'satellizer', 'leaflet-directive', 'ngResource', 'vsGoogleAutocomplete'
  ]);

app.controller('MainController', MainController)
    .controller('HomeController', HomeController)
    .controller('CreateStoryController', CreateStoryController)
    .controller('ShowStoryController', ShowStoryController)
    .controller('LoginController', LoginController)
    .controller('SignupController', SignupController)
    .controller('LogoutController', LogoutController)
    .controller('ProfileController', ProfileController)
    .controller('LandingController', LandingController)
    .controller('DiscoverController', DiscoverController)
    .service('Account', Account)
    .factory('Story', StoryFactory)
    .factory('Pin', PinFactory)
    .config(configRoutes)
    ;

//==============================================================================

////////////
// ROUTES //
////////////

//==============================================================================

configRoutes.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"]; // minification protection
function configRoutes($stateProvider, $urlRouterProvider, $locationProvider) {

  //this allows us to use routes without hash params!
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  // for any unmatched URL redirect to /
  $urlRouterProvider.otherwise("/");

  $stateProvider
  .state('landing', {
    url: '/',
    templateUrl: 'templates/landing.html',
    controller: 'LandingController',
    controllerAs: 'landing'
    })
  .state('discover', {
    url: '/discover',
    templateUrl: 'templates/discover.html',
    controller: 'DiscoverController',
    controllerAs: 'discover'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeController',
      controllerAs: 'home',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('show-story', {
      url: '/story/:id',
      templateUrl: 'templates/show_story.html',
      controller: 'ShowStoryController',
      controllerAs: 'ss'
    })
    .state('create-story', {
      url: '/create-story',
      templateUrl: 'templates/create_story.html',
      controller: 'CreateStoryController',
      controllerAs: 'cc',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignupController',
      controllerAs: 'sc',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController',
      controllerAs: 'lc',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .state('logout', {
      url: '/logout',
      template: null,
      controller: 'LogoutController',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileController',
      controllerAs: 'profile',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('about', {
      url: '/about',
      templateUrl: 'templates/about.html'
    })


    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }

}

//==============================================================================

/////////////////
// CONTROLLERS //
/////////////////

//==============================================================================

MainController.$inject = ["Account"]; // minification protection
function MainController (Account) {
  var vm = this;

  vm.currentUser = function() {
   return Account.currentUser();
  }

}

//==============================================================================
//Story is embedded as factory but not being used right now
LandingController.$inject = ["$http", "Account", "$scope"]; // minification protection
function LandingController ($http, Account, $scope) {
  var vm = this;

  vm.currentUser = function() {
   return Account.currentUser();
  }

}

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

//==============================================================================

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

ShowStoryController.$inject = ["$http", "Account", "$scope", "Story", "$stateParams"];
function ShowStoryController ($http, Account, $scope, Story, $stateParams){
  var vm = this;

  vm.story = {};

  angular.extend($scope, {
      //originally sets map in london
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

  //get specific user's story
  $http.get('/api/stories/' + $stateParams.id)
      .then(function (response) {

          //each story is the response
          vm.story = response.data;

          console.log(vm.story.pins);

          // vm.story.pins[0].activeChapter = true;
          // console.log(vm.story.pins[0].activeChapter);

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

                console.log(" PIN ", pin);
                 $scope.markers[pin.pinOrder] = {
                   lat: pin.latitude,
                   lng: pin.longitude,
                   message: embeddedMessage,
                   draggable: false,
                   focus: true
                }


              }

            // console.log(pin);
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



          //goes through story pins again and individually
          // vm.story.pins.forEach(function(pin){
          //
          //   if(vm.story.pins.indexOf(pin) === vm.counter){
          //     console.log(pin);
          //     pin.activeChapter = true;
          //   }
          //
          //   if(vm.counter !== 0){
          //     vm.story.pins[vm.counter - 1].activeChapter = false;
          //   }
          //
          //   var embeddedMessage = "";
          //   //if there's no image URL then it embeds only the text content
          //   if(pin.photoUrl){
          //     embeddedMessage += "<img class='embedded-map-images' src='"+ pin.photoUrl + "'></img>";
          //   }
          //
          //   embeddedMessage += "  " + pin.textContent;
          //
          //     console.log(" PIN ", pin);
          //      $scope.markers[pin.pinOrder] = {
          //        lat: pin.latitude,
          //        lng: pin.longitude,
          //        message: embeddedMessage,
          //        draggable: false,
          //        focus: true
          //     }
          // });




//==============================================================================
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

//==============================================================================
LoginController.$inject = ["Account", "$location"]; // minification protection
function LoginController (Account, $location) {
  var vm = this;
  vm.new_user = {}; // form data


  vm.login = function() {
    Account
      .login(vm.new_user)
      .then(function(){
        // console.log("NEW USER ", vm);
        //  #5: redirect to '/home'
         $location.path('/create-story');
         //  #4: clear sign up form
         vm.new_user = {};

      })
  };
}

//==============================================================================

SignupController.$inject = ['Account', '$location']; // minification protection
function SignupController (Account, $location) {
  var vm = this;
  vm.new_user = {}; // form data

  vm.signup = function() {
    Account
      .signup(vm.new_user)
      .then(
        function (response) {
          //  #9: clear sign up form
          vm.new_user = {};
          //  #10: redirect to '/profile'
          $location.path('/create-story');
        }
      );
  };
}

//==============================================================================
LogoutController.$inject = ["Account", "$location"]; // minification protection
function LogoutController (Account, $location) {
  Account
    .logout()
    .then(function(){
      $location.path('/');
    })

  //  #7: when the logout succeeds, redirect to the login page

}

//==============================================================================
ProfileController.$inject = ['Account']; // minification protection
function ProfileController (Account) {
  var vm = this;
  vm.new_profile = {}; // form data

  vm.showEditForm = false;

  vm.updateProfile = function() {
    Account
      .updateProfile(vm.new_profile)
      .then(function(){
        vm.new_profile = {};
        vm.showEditForm = false;
      })
    //  #14: Submit the form using the relevant `Account` method
    // On success, clear the form

  };
}

//==============================================================================


//////////////
// Services //
//////////////


// STORY FACTORY ============================================
StoryFactory.$inject = ["$resource"]; // minification protection
function StoryFactory($resource) {
  return $resource('/api/stories/:id', {id: '@_id'},
    {
      'update': {method: 'PUT'}
    });
}

// Pin FACTORY ============================================
PinFactory.$inject = ["$resource"]; // minification protection
function PinFactory($resource) {
  return $resource('/api/pins/:id', {id: '@_id'},
    {
      'update': {method: 'PUT'}
    });
}


// ACCOUNT SERVICE ===================================================

Account.$inject = ["$http", "$q", "$auth"]; // minification protection
function Account($http, $q, $auth) {
  var self = this;
  self.user = null;

  self.signup = signup;
  self.login = login;
  self.logout = logout;
  self.currentUser = currentUser;
  self.getProfile = getProfile;
  self.updateProfile = updateProfile;


  function signup(userData) {
    //  #8: signup (https://github.com/sahat/satellizer#authsignupuser-options)
    return (
      $auth
        .signup(userData)
        .then(function(response) {
        // Redirect user here to login page or perhaps some other intermediate page
      // that requires email address verification before any other part of the site
      // can be accessed.

          $auth.setToken(response.data.token);
        })
      .catch(function(response) {
        console.log("handling errors?", response);
        })
    // then, set the token (https://github.com/sahat/satellizer#authsettokentoken)
    // returns a promise
      );
    }

  function login(userData) {
    return (
      $auth
        .login(userData) // login (https://github.com/sahat/satellizer#authloginuser-options)
        .then(
          function onSuccess(response) {
            // #3: set token (https://github.com/sahat/satellizer#authsettokentoken)
            console.log('login response', response);
            $auth.setToken(response.data.token);
            console.log('token', response.data.token);
          },

          function onError(error) {
            console.error(error);
          }
        )
    );
  }

  function logout() {
    // returns a promise!!!
    //  #6: logout the user by removing their jwt token (using satellizer)
    // Make sure to also wipe the user's data from the application:
    // self.user = null;
    // returns a promise!!!
    return (
      $auth
        .logout()
        .then(function(){
          $auth.removeToken();
          self.user = null;
        })
    )



  }


  function currentUser() {
    if ( self.user ) { return self.user; }
    if ( !$auth.isAuthenticated() ) { return null; }

    var deferred = $q.defer();
    getProfile().then(
      function onSuccess(response) {
        self.user = response.data;
        deferred.resolve(self.user);
      },

      function onError() {
        $auth.logout();
        self.user = null;
        deferred.reject();
      }
    )
    self.user = promise = deferred.promise;
    return promise;

  }

  function getProfile() {
    return $http.get('/api/me');
  }

  function updateProfile(profileData) {
    return (
      $http
        .put('/api/me', profileData)
        .then(
          function (response) {
            self.user = response.data;
          }
        )
    );
  }


}
