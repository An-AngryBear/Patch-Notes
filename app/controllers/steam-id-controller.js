'use strict';

patchNotesApp.controller('SteamIdController', function($scope, $routeParams, $window, SteamIdFactory, GameFactory) {

	let userGamesToDisplay = [];

	//takes an array of games and filters them out by what the user has played in the
	//last two weeks. sticks them in userGamesToDisplay array
	let getRecentGames = (games) => {
		let arrOfGames = Object.values(games);
		let recentGames = arrOfGames[1].filter( (game) => {
			return game.playtime_2weeks;
		});
		userGamesToDisplay = userGamesToDisplay.concat(recentGames);
		console.log("games played in last 2 weeks", recentGames);
	};

	//takes an array of games and filters them out by games the user has over 5 hours in
	//and hasn't been recently played sorts them in descending order starting with the
	//most played game. adds to the userGamesToDisplay array, so as to come *after* the
	//most recently played games
	let getPlayedGames = (games) => {
		let arrOfGames = Object.values(games);
		let playedGames = arrOfGames[1].filter( (game) => {
			if(!game.playtime_2weeks) {
				return game.playtime_forever > 300;
			}
		})
		.sort(function(a, b) {
			return b.playtime_forever - a.playtime_forever;
		});
		userGamesToDisplay = userGamesToDisplay.concat(playedGames);
		console.log("userGamesToDisplay2", userGamesToDisplay);
	};

	$scope.fetchSteamGames = (steamProfileName) => {
		SteamIdFactory.getSteamId(steamProfileName)
		.then( (data) => {
			return GameFactory.getOwnedGames(data);
		})
		.then( (games) => {
			console.log("full game list", games);
			getRecentGames(games);
			getPlayedGames(games);
		});
	};




	$scope.steamURL = "";

});

