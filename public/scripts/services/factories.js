var app = angular.module('GulliverApp');
app.service('StoryService', StoryService);
app.service('MapboxService', MapboxService);
app.service('YourStoryService', YourStoryService);

// STORY FACTORY ============================================
StoryService.$inject = ["$resource"]; // minification protection
function StoryService($resource) {
  return $resource('/api/stories/:id', {id: '@_id'},
    {
      'update': {method: 'PUT'}
    });
}

// STORY FACTORY THAT DISPLAYS ONLY SELECTED USER'S STORY============================================
YourStoryService.$inject = ["$resource", "Account"]; // minification protection
function YourStoryService($resource, Account) {
  return $resource('/api/users/'+ Account.currentUser()._id +'/stories', {id: '@_id'},
    {
      'update': {method: 'PUT'}
    });
}


// ACCESS MAPBOX API ============================================
MapboxService.$inject = ["$resource"]; // minification protection
function YourStoryService($resource) {
  return $resource('https://api.mapbox.com/geocoding/v5/mapbox.places/'+vm.new_location.locationName+'.json?access_token=' + MAPBOX_API_TOKEN + '&autocomplete=true');
}


// Pin FACTORY ============================================
PinService.$inject = ["$resource"]; // minification protection
function PinService($resource) {
  return $resource('/api/pins/:id', {id: '@_id'},
    {
      'update': {method: 'PUT'}
    });
}
