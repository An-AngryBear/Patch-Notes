'use strict';

patchNotesApp.controller('UserController', function($scope, $routeParams, $window, UserFactory, UserData) {

	let currentUser = null;
	$scope.account = {
	    email: "",
	    password: ""
 	};

 	$scope.register = () => {
 	  UserFactory.createUser($scope.account)
 	  .then( (userData) => {
 	    console.log("New User!", userData);
 	    $scope.login();
 	    $window.location.href = "#!/enter-url.html";
 	  });
 	};

 	$scope.login = () => {
 	  UserFactory.loginUser($scope.account)
 	  .then( (userData) => {
 	  	UserData.getSteamId(userData.uid)
 	  	.then( (data) => {
  			let steamID = Object.values(data.data)[0].steamid;
  			$window.location.href = `#!/game-list/${steamID}/${userData.uid}`;
 	  	})
 	  	.catch( (err) => {
 	  		console.log("NO STEAM ID FOUND");
 	  		$window.location.href = "#!/";
 	  	});
 	  });
 	};
});
