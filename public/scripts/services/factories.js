var app = angular.module('GulliverApp');
app.factory('Story', StoryFactory)
app.factory('Pin', PinFactory)

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
