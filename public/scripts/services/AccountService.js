//=============================Account Service==============================
var app = angular.module('GulliverApp');
app.service('Account', Account);

//==============================================================================


//////////////
// Services //
//////////////


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
      // then, set the token
      // returns a promise
        );
      }

    function login(userData) {
      return (
        $auth
          .login(userData) // login
          .then(
            function onSuccess(response) {
              $auth.setToken(response.data.token);
            },

            function onError(error) {
              console.error(error);
            }
          )
      );
    }

    function logout() {
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
