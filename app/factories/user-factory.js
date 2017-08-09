'use strict';

patchNotesApp.factory("UserFactory", function($q, $http, FirebaseUrl, FBCreds) {

	var config = {
	    apiKey: FBCreds.key,
	    authDomain: FBCreds.authDomain
	};

	firebase.initializeApp(config);

	let currentUser = null;

  let isAuthenticated = function() {
    console.log("isAuthenticated called");
    return new Promise( (resolve, reject) => {
      console.log("firing onAuthStateChanged");
      firebase.auth().onAuthStateChanged(function(user) {
        console.log("onAuthStateChanged finished");
        if (user) {
          console.log("user", user);
          currentUser = user.uid;
          resolve(true);
        } else {
          currentUser = null;
          resolve(false);
        }
      });
    });
  };

	let getUser = () => {
		return currentUser;
	};

  let createUser = (userObj) => {
    return firebase.auth().createUserWithEmailAndPassword(userObj.email, userObj.password)
    .catch( (err) => {
      console.log("USER CREATE ERROR", err.message);
    });
  };

	let loginUser = (userObj) => {
    return $q( (resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(userObj.email, userObj.password)
      .then( (user) => {
        currentUser = user.uid;
        resolve(user);
      })
      .catch( (err) => {
        console.log("LOG IN ERROR", err.message);
      });
    });
  };

  let logoutUser = () => {
    return firebase.auth().signOut()
    .catch( (err) => {
      console.log("LOG OUT ERROR", err.message);
    });
  };

	return {isAuthenticated, getUser, createUser, loginUser, logoutUser};

});
