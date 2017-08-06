'use strict';

patchNotesApp.factory("GameData", function($q, $http, FirebaseUrl, SteamCreds) {

	let gameData = {};
	gameData.games = [];

	gameData.add = (game) => {
		gameData.games.push(game);
	};

	return gameData;
});