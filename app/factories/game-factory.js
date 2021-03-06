'use strict';

patchNotesApp.factory("GameFactory", function($q, $http, FirebaseUrl) {

	let getOwnedGames = (steamId) => {
		return $q( (resolve, reject) => {
			$http.get(`/game/${steamId}`)
			.then( (steamInfo) => {
				resolve(steamInfo.data.response);
			})
			.catch( (err) => {
				reject(err);
			});
		});
	};

	let getGameNews = (appId) => {
		return $q( (resolve, reject) => {
			$http.get(`/news/gamenews/${appId}`)
			.then( (steamInfo) => {
				resolve(steamInfo.data.appnews.newsitems);
			})
			.catch( (err) => {
				console.log("error", err);
				reject(err);
			});
		});
	};

	let getGameBanner = (appId) => {
		return $q( (resolve, reject) => {
			resolve(`http://cdn.edgecast.steamstatic.com/steam/apps/${appId}/header.jpg`);
		});
	};

	return {getOwnedGames, getGameNews, getGameBanner};

});