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

	return {postGame, postSteamId, getSteamId};
});