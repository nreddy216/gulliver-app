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
  //  .service('Account', Account)
   .config(configRoutes);

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

//=============================Main Controller==============================

MainController.$inject = ["Account"]; // minification protection
function MainController (Account) {
  var vm = this;

  vm.currentUser = function() {
   return Account.currentUser();
  }

}

//======================================================================
