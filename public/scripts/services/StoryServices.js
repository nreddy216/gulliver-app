var app = angular.module('GulliverApp');
app.service('StoryService', StoryService);
app.service('YourStoryService', YourStoryService);
app.factory('TokenFactory', TokenFactory);

// STORY SERVICE ============================================
StoryService.$inject = ["$resource"]; // minification protection
function StoryService($resource) {
  return $resource('/api/stories/:id', {id: '@_id'},
    {
      'update': {method: 'PUT'}
    });
}

// STORY SERVICE THAT DISPLAYS ONLY SELECTED USER'S STORY============================================
YourStoryService.$inject = ["$resource", "Account"]; // minification protection
function YourStoryService($resource, Account) {
  return $resource('/api/users/'+ Account.currentUser()._id +'/stories', {id: '@_id'},
    {
      'update': {method: 'PUT'}
    });
}

// Get Mapbox Token to use for Map JSON============================================

TokenFactory.$inject = ["$http"];
function TokenFactory($http){

    return {
      getMapboxToken: function(){
        return $http.get('/api/mapboxToken');
      }
    }

}
