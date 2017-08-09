'use strict';

patchNotesApp.controller('EnterUrlController', function($scope, $routeParams, $window, UserFactory, UserData) {

	let currentUser = null;

	$scope.steamURL = "";

	UserFactory.isAuthenticated()
	.then( (user) => {
	  console.log("user status", user);
	  currentUser = UserFactory.getUser();
	  if (currentUser) {
	  	UserData.getSteamId(currentUser)
	  	.then( (data) => {
 			let steamID = Object.values(data.data)[0].steamid;
 			$window.location.href = `#!/game-list/${steamID}`;
	  	})
	  	.catch( (err) => {
	  		console.log("NO STEAM ID");
	  	});
	  }
	});

	$scope.enterSteamName = () => {
		$window.location.href = `#!/game-list/${$scope.steamURL}`;
		console.log("WHAT IS YOUR CURRENT USER?", currentUser);
	};
});