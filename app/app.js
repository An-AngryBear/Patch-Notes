'use strict';

let patchNotesApp = angular.module("PatchNotesApp", ["ngRoute"])
.constant("FirebaseUrl", "https://patch-notes-919df.firebaseio.com/");

patchNotesApp.config( ($routeProvider) => {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/enter-url.html',
    controller: 'SteamController'
  })
  .when('/game-list', {
  	templateUrl: 'partials/game-list.html',
  	controller: 'SteamController'
  })
  .when('/patch-notes', {
  	templateUrl: 'partials/patch-notes.html',
  	controller: 'PatchNotesController'
  })
  .otherwise('/');
});