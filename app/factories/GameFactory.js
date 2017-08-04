'use strict';

patchNotesApp.factory("GameFactory", function($q, $http, FirebaseUrl, SteamCreds) {

	let apiKey = SteamCreds.key;

	let getOwnedGames = (steamId) => {
		return $q( (resolve, reject) => {
			$http.get(`http://localhost:4000/steam/game/${apiKey}/${steamId}`)
			.then( (steamInfo) => {
				console.log(steamInfo);
				resolve(steamInfo.data.response);
			})
			.catch( (err) => {
				reject(err);
			});
		});
	};

	let getGameNews = (appId) => {
		return $q( (resolve, reject) => {
			$http.get(`http://localhost:4000/steam/gamenews/${appId}`)
			.then( (steamInfo) => {
				console.log(steamInfo);
				resolve(steamInfo.data);
			})
			.catch( (err) => {
				reject(err);
			});
		});
	};

	return {getOwnedGames, getGameNews};

});