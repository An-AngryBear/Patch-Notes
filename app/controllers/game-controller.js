'use strict';

patchNotesApp.controller('PatchNotesController', function($scope, $routeParams, $window, GameData) {
	let self = this;
	console.log("this", this);

	self.gameData = GameData.games;
});
