
//insert all modules
var app = angular.module('TravelogueApp', ['ui.router','ngResource', 'satellizer', 'ngMessages', 'ngRoute']);

app.config(config)
   .controller('MainCtrl', MainCtrl)
   .controller('LandingCtrl', LandingCtrl)
   .controller('ProfileCtrl', ProfileCtrl)
   .controller('LoginCtrl', LoginCtrl)
   .controller('SignupCtrl', SignupCtrl)
   .controller('LogoutCtrl', LogoutCtrl)
   .service('Account', Account);

// UI ROUTES=========================================

//is this needed?
config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

function config ( $locationProvider, $stateProvider, $urlRouterProvider ) {
  console.log("Config loaded.");

  //this allows us to use routes without hash params!
  $locationProvider.html5Mode({
  enabled: true,
  requireBase: false
  });

    // return to user-index if bad route request
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('landing-page', {
          url: '/',
          controller: 'LandingCtrl',
          templateUrl: "views/landing_page.html"
      })
      .state('sign-up', {
          url: '/sign-up',
          templateUrl: "views/sign_up.html",
          controller: 'SignupCtrl',
          resolve: {
            skipIfLoggedIn : skipIfLoggedIn
          }
      })
      .state('login', {
          url: '/login,
          templateUrl: "templates/login.html",
          controller: 'LoginCtrl',
          resolve: {
            loginRequired : loginRequired
          }
      })
      .state('logout', {
          url: '/logout',
          template: null,
          controller: 'LogoutCtrl',
          resolve: {
            skipIfLoggedIn : skipIfLoggedIn
          }
      })
      .state('profile', {
          url: '/profile',
          templateUrl: "views/profile.html",
          controller: 'ProfileCtrl',
          resolve: {
            loginRequired : loginRequired
          }
      });

};



  // story resource
  // app.service('Story', function($resource){
  //   return $resource('http://localhost:3000/api/stories', { id: '@_id' }, {
  //     update: {
  //       method: 'PUT' // this method issues a PUT request
  //     }
  //   });
  // });
  //
  // app.controller('StoryCtrl', StoryCtrl);
  //
  // function StoryCtrl(Story){
  //
  //   console.log(Story);
  //
  //   console.log("Home Controller Loaded");
  //   var vm = this;
  //   vm.homeTest = "Welcome to the homepage!";
  //
  //   vm.newStory = {};
  //   vm.todos = Story.query();
  //   vm.createStory = createStory;
  //   vm.updateStory = updateStory;
  //   vm.deleteStory = deleteStory;
  //   vm.markCompleted = markCompleted;
  //
  //
  //   function createStory(){
  //     vm.newStory.completed = false;
  //     Story.save(vm.newStory);
  //     vm.todos.unshift(vm.newStory);
  //     vm.newStory = {};
  //   }
  //
  //   function deleteStory(todo){
  //     // console.log("delete");
  //     Story.remove({id: todo._id});
  //     var index = vm.todos.indexOf(todo);
  //     vm.todos.splice(index, 1);
  //   }
  //
  //   function markCompleted(todo){
  //     console.log('mark');
  //     todo.completed = true;
  //     Story.update(todo);
  //   }
  //
  //
  //   function updateStory(todo){
  //     console.log("update");
  //     Story.update(todo);
  //     // Story.save(todo);
  //     todo.displayEditForm = false;
  //   }
  //
  // };




///FUTURE REFACTOR
// var app = angular.module('TravelogueApp', ['ui.router','uiRoutes','ngResource', 'MainCtrl', 'PinCtrl', 'StoryCtrl', 'UserCtrl', 'PinService', 'StoryService', 'UserService']);
