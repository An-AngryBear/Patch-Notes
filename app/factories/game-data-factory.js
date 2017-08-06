'use strict';

patchNotesApp.factory("GameData", function($q, $http, FirebaseUrl, SteamCreds) {

	//service for supplying the application the most current gamedata objs
	let gameData = {};
	gameData.games = [];

	gameData.add = (game) => {
		gameData.games.push(game);
	};

	return gameData;
});