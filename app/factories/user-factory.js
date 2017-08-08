'use strict';

patchNotesApp.factory("UserFactory", function($q, $http, FirebaseUrl, FBCreds) {

	var config = {
	    apiKey: FBCreds.key,
	    authDomain: FBCreds.authDomain
	};

	firebase.initializeApp(config);

	let currentUser = null;

	let getUser = () => {
		return currentUser;
	};

	let loginUser = (userObj) => {
    return $q( (resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(userObj.email, userObj.password)
      .then( (user) => {
        // have to set the current user here because the controllers that call `getUser`
        // ( todo-controller, for example) are loading before the `onAuthStateChanged`
        // listener was kicking in and setting the user value
        currentUser = user.uid;
        resolve(user);
      })
      .catch( (err) => {
        console.log("LOG IN ERROR", err.message);
      });
    });
  };
	return {};
});