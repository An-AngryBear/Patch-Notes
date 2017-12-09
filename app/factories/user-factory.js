'use strict';

patchNotesApp.factory("UserFactory", function($q, $http, FirebaseUrl) {
  
  var config = null;
  let currentUser = null;

  //asks the server for FB creds
  let getFBConfig = () => {
		return $q( (resolve, reject) => {
			$http.get(`http://localhost:4000/fbconfig`)
			.then( (fbconfig) => {
				resolve(fbconfig.data);
			})
			.catch( (err) => {
				reject(err);
			});
		});
	};

  //checks to see if the current user is set
  let authCheck = (resolve) => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        currentUser = user.uid;
        resolve(true);
      } else {
        currentUser = null;
        resolve(false);
      }
    });
  };

  //if there are no fb creds, makes call for them then checks if authenticated. if there are fb creds, skips call and checks if authenticated
  let isAuthenticated = function() {
    return new Promise( (resolve, reject) => {
      if(!config) {
        getFBConfig()
        .then( (data) => {
            config = {
              apiKey: data.apikey,
              authDomain: data.authDomain
            };
            firebase.initializeApp(config);
            authCheck(resolve);
        });
      } else {
        authCheck(resolve);
      }
    });
  };

	let getUser = () => {
		return currentUser;
	};

  let createUser = (userObj) => {
    return firebase.auth().createUserWithEmailAndPassword(userObj.email, userObj.password)
    .catch( (err) => {
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
      });
    });
  };

  let logoutUser = () => {
    return firebase.auth().signOut()
    .catch( (err) => {
    });
  };

	return {isAuthenticated, getUser, createUser, loginUser, logoutUser, getFBConfig};

});
