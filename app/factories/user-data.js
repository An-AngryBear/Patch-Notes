'use strict';

patchNotesApp.factory("UserData", function($q, $http, FirebaseUrl) {

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

	return {postGame};
});