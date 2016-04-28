//=============================Auth Controllers==============================
'use strict';

var app = angular.module('GulliverApp');
app.controller('LoginController', LoginController)
   .controller('SignupController', SignupController)
   .controller('LogoutController', LogoutController)
   .controller('ProfileController', ProfileController);


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
        //  redirect to '/home'
         $location.path('/create-story');
         //  clear sign up form
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
          //  clear sign up form
          vm.new_user = {};
          //  redirect to '/profile'
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

  //  when the logout succeeds, redirect to the login page

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
    //  Submit the form using the relevant `Account` method
    // On success, clear the form

  };
}
