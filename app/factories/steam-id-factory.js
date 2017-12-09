'use strict';

patchNotesApp.factory("SteamIdFactory", function($q, $http, FirebaseUrl) {
	
	let getSteamId = (steamProfileName) => {
		return $q( (resolve, reject) => {
			$http.get(`/steam/${steamProfileName}`)
			.then( (steamInfo) => {
				resolve(steamInfo.data.response.steamid);
			})
			.catch( (err) => {
				console.log(err);
				reject(err);
			});
		});
	};

	return {getSteamId};

});