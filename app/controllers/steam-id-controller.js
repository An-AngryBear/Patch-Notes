'use strict';

patchNotesApp.controller('SteamIdController', function($scope, $routeParams, $window, SteamIdFactory) {

	$scope.fetchSteamId = (steamProfileName) => {
		SteamIdFactory.getSteamId(steamProfileName)
		.then( (data) => {
			console.log(data);
		});
	};

	$scope.steamURL = "";

});
