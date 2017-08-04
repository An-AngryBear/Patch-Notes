'use strict';

patchNotesApp.factory("SteamIdFactory", function($q, $http, FirebaseUrl, SteamCreds) {

	let apiKey = SteamCreds.key;

	let getSteamId = (steamProfileName) => {
		return $q( (resolve, reject) => {
			$http.get(`http://localhost:4000/steam/${steamProfileName}/${apiKey}`)
			.then( (steamInfo) => {
				console.log(steamInfo);
				resolve(steamInfo.data.response.steamid);
			})
			.catch( (err) => {
				reject(err);
			});
		});
	};

	return {getSteamId};

});