'use strict';

patchNotesApp.factory("UserData", function($q, $http, FirebaseUrl) {

	let getSteamId = (userId) => {
	  console.log("userId", userId);
	  return $q( (resolve, reject) => {
	    $http.get(`${FirebaseUrl}steamids.json?orderBy="uid"&equalTo="${userId}"`)
	    .then( (data) => {
	      resolve(data);
	    })
	    .catch( (err) => {
	      console.log("oops", err);
	      reject(err);
	    });
	  });
	};

	let getGames = (userId) => {
	  console.log("userId", userId);
	  return $q( (resolve, reject) => {
	    $http.get(`${FirebaseUrl}games.json?orderBy="uid"&equalTo="${userId}"`)
	    .then( (data) => {
	      resolve(data.data);
	    })
	    .catch( (err) => {
	      console.log("oops", err);
	      reject(err);
	    });
	  });
	};

	let deleteGame = (gameId) => {
	    return $q( (resolve, reject) => {
	      if (gameId) {
	        $http.delete(`${FirebaseUrl}games/${gameId}.json`)
	        .then( (data) => {
	          resolve(data);
	        })
	        .catch( (err) => {
	          reject(err);
	        });
	      } else {
	        console.log("No id passed in");
	      }
	    });
	};


	let postGame = (newItem) => {
	  return $q( (resolve, reject) => {
	    $http.post(`${FirebaseUrl}games.json`,
	      angular.toJson(newItem))
	    .then( (newItemData) => {
	      resolve(newItemData);
	    })
	    .catch( (err) => {
	      reject(err);
	    });
	  });
	};

	let postSteamId = (newItem) => {
	  return $q( (resolve, reject) => {
	    $http.post(`${FirebaseUrl}steamids.json`,
	      angular.toJson(newItem))
	    .then( (newItemData) => {
	      resolve(newItemData);
	    })
	    .catch( (err) => {
	      reject(err);
	    });
	  });
	};

	return {postGame, postSteamId, getSteamId, getGames, deleteGame};
});