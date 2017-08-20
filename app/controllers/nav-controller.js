'use strict';

patchNotesApp.controller('NavController', function($scope, FilterFactory, $routeParams, $window, UserFactory, UserData, $route) {

	let currentUser = null;

	$scope.goLoginPage = () => {
		$window.location.href = '#!/login';
	};

	$scope.searchFilter = FilterFactory;

	UserFactory.isAuthenticated()
	.then( (user) => {
	  console.log("user status:gameList", user);
	  currentUser = UserFactory.getUser();
	});

	$scope.logOut = () => {
		UserFactory.logoutUser()
		.then( (data) => {
			currentUser = null;
			$window.location.href = '#!/';
		});
	};

	$scope.userCheck = () => {
		console.log("USER??", currentUser);
		// currentUser = UserFactory.getUser();
		if(currentUser) {
			return true;
		} else {
			return false;
		}
	};

	$scope.gameListCheck = () => {
		if($route.current.loadedTemplateUrl === 'partials/game-list.html') {
			return true;
		} else {
			return false;
		}
	};


});
