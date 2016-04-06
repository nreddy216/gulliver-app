//==============================================================================

////////////
// SETUP //
////////////

//==============================================================================

var app = angular
  .module('TravelogueApp', [
    'ui.router', 'satellizer', 'leaflet-directive', 'ngResource'
    // #2: Add satellizer module
  ]);

app.controller('MainController', MainController)
    .controller('HomeController', HomeController)
    .controller('CreateStoryController', CreateStoryController)
    .controller('ShowStoryController', ShowStoryController)
    .controller('LoginController', LoginController)
    .controller('SignupController', SignupController)
    .controller('LogoutController', LogoutController)
    .controller('ProfileController', ProfileController)
    .controller('MapController', MapController)
    .controller('PinController', PinController)
    .service('Account', Account)
    .factory('Story', StoryFactory)
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
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
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
      controllerAs: 'cc'
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

CreateStoryController.$inject = ["$http", "Account", "Story", "$scope"]; // minification protection
function CreateStoryController ($http, Account, Story, $scope) {
  var vm = this;
  vm.stories = []; //where all of user's stories will be stored
  vm.new_story = {}; //form data
  vm.storyId = "";
  vm.storyTitle = "";
  vm.pinCounter = 0;

  vm.new_location = {};
  vm.locations = [];

  vm.displayPinForm = false;

  vm.createStory = function(){
    console.log("create story: ", vm.new_story);
    $http.post('/api/users/' + Account.currentUser()._id + '/stories', vm.new_story)
      .then(function (response) {
        vm.pinCounter = 0; //add counter to pin data
        vm.new_story = {};
        vm.storyId = response.data._id; //get id so that pins can be added to this story
        vm.storyTitle = response.data.title;
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

  vm.mapAttributes = angular.extend($scope, {
      //originally sets map in london
      center: {
          lat: 51.505,
          lng: -0.09,
          zoom: 4
      },
      markers: {
      },
      defaults: {
        scrollWheelZoom: false,
        zoomControl: false
      }
  });



   //adding pin
  vm.addPin = function(coordinates){
    vm.pinCounter += 1;
    vm.new_location.pinOrder = vm.pinCounter;
    vm.new_location.longitude = coordinates[0];
    vm.new_location.latitude = coordinates[1];


    $scope.markers[vm.pinCounter] = {
      lat: vm.new_location.latitude,
      lng: vm.new_location.longitude,
      message: vm.new_location.textContent,
      draggable: false,
      focus: true
    }


     vm.geocode();
     $http.post('/api/stories/' + vm.storyId + '/pins', vm.new_location)
       .then(function(data) {
         vm.locations.push(data);
         vm.new_location = {};
         console.log("location res", data);
     });

     console.log(vm.mapAttributes);
  }

  vm.pins = []; //where all of user's chapters/pins will be stored

  //get specific user's stories
  $http.get('/api/stories/' + vm.storyId + '/pins')
      .then(function (response) {
        vm.pins.push(response.data);
      });
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
        scrollWheelZoom: false,
        zoomControl: false
      }
  });

  //get specific user's story
  $http.get('/api/stories/' + $stateParams.id)
      .then(function (response) {

          //each story is the response
          vm.story = response.data;

          vm.story.pins.forEach(function(pin){
              console.log(" PIN ", pin);
               $scope.markers[pin.pinOrder] = {
                 lat: pin.latitude,
                 lng: pin.longitude,
                 message: pin.pinOrder + ": " + pin.textContent,
                 draggable: false,
                 focus: true
              }
          });

          console.log($scope.markers);

      });




  // console.log(vm.stories);

//display all pins




}


//==============================================================================
//Story is embedded as factory but not being used right now
HomeController.$inject = ["$http", "Account", "Story", "$scope"]; // minification protection
function HomeController ($http, Account, Story, $scope) {
    var vm = this;
    vm.stories = []; //where all of user's stories will be stored
    vm.new_story = {}; //form data

    //get specific user's stories
    $http.get('/api/users/'+ Account.currentUser()._id +'/stories')
        .then(function (response) {
          vm.stories.push(response.data);
          console.log(response.data);
        });

    ///HAVENT DONE THIS YET
    vm.deleteStory = function(story){
      console.log("delete story");

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
        //  #5: redirect to '/profile'
         $location.path('/profile');
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
          $location.path('/profile');
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
      $location.path('/login');
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
MapController.$inject = ['$http', '$scope'];
function MapController ($http, $scope){
  // var vm = this;
  // vm.test = "map control works";

  angular.extend($scope, {
      //originally sets map in london
      center: {
          lat: 51.505,
          lng: -0.09,
          zoom: 4
      },
      markers: {
        testPin: {
          lat: 51.505,
          lng: -0.09,
          message: "Hi is this working?",
          focus: true,
          draggable: false
        }
      },
      defaults: {
        scrollWheelZoom: false
      }
  });

}
//==============================================================================
PinController.$inject = ['$http'];
function PinController ($http){
  var self = this;

  angular.extend(self , {
    osloCenter: {
      lat: 59.91,
      lng: 10.75,
      zoom: 12
    },
    pins: {
      osloMarker: {
        lat: 59,
        lng: 10,
        message: "HERE IT IS",
        focus: true,
        draggable: false
      }
    },
      defaults: {
        scrollWheelZoom: false
      }
  });
}



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
// PinFactory.$inject = ["$resource"]; // minification protection
// function PinFactory($resource) {
//   return $resource('/api/stories/:id/pins', {id: '@_id'},
//     {
//       'update': {method: 'PUT'}
//     });
// }


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
