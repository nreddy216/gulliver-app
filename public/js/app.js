
//insert all modules
var app = angular.module('TravelogueApp', ['ui.router','satellizer']);

app.controller('MainCtrl', MainCtrl)
   .controller('LandingCtrl', LandingCtrl)
   .controller('ProfileCtrl', ProfileCtrl)
   .controller('LoginCtrl', LoginCtrl)
   .controller('SignupCtrl', SignupCtrl)
   .controller('LogoutCtrl', LogoutCtrl)
   .service('Account', Account)
   .config(configRoutes);

// UI ROUTES=========================================

configRoutes.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

function configRoutes ( $stateProvider,  $urlRouterProvider, $locationProvider ) {
  console.log("Config Routes loaded.");

  //lets us use routes without hash params
  $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
  });

  // return to user-index if bad route request
  $urlRouterProvider.otherwise("/");

  //template switching happens here
  $stateProvider
    .state('landing-page', {
        url: '/',
        controller: 'LandingCtrl',
        templateUrl: "views/landing_page.html"
    })
    .state('signup', {
        url: '/signup',
        templateUrl: "views/sign_up.html",
        controller: 'SignupCtrl',
        resolve: {
          skipIfLoggedIn : skipIfLoggedIn
        }
    })
    .state('login', {
        url: '/login',
        templateUrl: "views/login.html",
        controller: 'LoginCtrl',
        resolve: {
          skipIfLoggedIn : skipIfLoggedIn
        }
    })
    .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl',
        resolve: {
          loginRequired : loginRequired
        }
    })
    .state('profile', {
        url: '/profile',
        templateUrl: "views/profile.html",
        controller: 'ProfileCtrl',
        resolve: {
          loginRequired : loginRequired
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

/////////////////
// CONTROLLERS //
/////////////////

MainCtrl.$inject = ["Account"]; // minification protection
function MainCtrl (Account) {
  var vm = this;

  var test = function(){
    console.log("OMG IS THIS WORKING");
  };

  vm.test = test();

  vm.currentUser = function() {
   return Account.currentUser();
  }

}

LandingCtrl.$inject = ["$http", "Account"];
function LandingCtrl ($http, Account) {
  var vm = this;

  console.log(Account);

  this.test = function(){
    console.log("test landing ctrl connected");
  }
  // vm.test = "test landing ctrl is connected";
  console.log("LANDING CTRL");
}

// LandingCtrl.$inject = ["$http"]; // minification protection
// function HomeController ($http) {
//   var vm = this;
//   vm.stories = [];
//   vm.new_story = {}; // form data
//
//   $http.get('/api/users/:id/stories')
//     .then(function (response) {
//       vm.stories = response.data;
//     });
//
//   vm.createPost = function(){
//     console.log("create post: ", vm.new_story);
//     $http.post('/api/stories', vm.new_story)
//       .then(function (response) {
//         vm.posts.push(response.data);
//         vm.new_post = {};
//       });
//   }
// }

LoginCtrl.$inject = ["Account", "$location"]; // minification protection
function LoginCtrl (Account, $location) {
  var vm = this;
  vm.new_user = {}; // form data

  vm.login = function() {
    Account
      .login(vm.new_user)
      .then(function(){
         //clear sign up form
         vm.new_user = {};
         // redirect to '/profile'
         // should it redirect to /users/:id ?
         $location.path('/profile');

      })
  };
}

SignupCtrl.$inject = ['Account', '$location']; // minification protection
function SignupCtrl (Account, $location) {
  var vm = this;
  vm.new_user = {}; // form data

  vm.test = function(){
    return "HELLO";
  }

  vm.signup = function() {
    console.log("SIGN UP");
    Account
      .signup(vm.new_user)
      .then(
        function (response) {
          // TODO #9: clear sign up form
          vm.new_user = {};
          // TODO #10: redirect to '/profile'
          $location.path('/profile');
        }
      );
  };
};

LogoutCtrl.$inject = ["Account", "$location"]; // minification protection
function LogoutCtrl (Account, $location) {
  // when the logout succeeds, redirect to the login page
  Account
    .logout()
    .then(function(){
      $location.path('/login');
    });
};


ProfileCtrl.$inject = ['Account']; // minification protection
function ProfileCtrl (Account) {
  // Submit the form using the relevant `Account` method
  // On success, clear the form

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
  };
}

//////////////
// Services //
//////////////

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
    console.log("SIGN UP ", userData);
    // #8: signup (https://github.com/sahat/satellizer#authsignupuser-options)
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
            //#3: set token (https://github.com/sahat/satellizer#authsettokentoken)
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
    // #6: logout the user by removing their jwt token (using satellizer)
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
    //they had api/me
    return $http.get('/api/me');
  }

  function updateProfile(profileData) {
    return (   //they had api/me
      $http
        .put('/api/users/:id', profileData)
        .then(
          function (response) {
            self.user = response.data;
          }
        )
    );
  }
}
