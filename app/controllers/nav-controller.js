'use strict';

patchNotesApp.controller('NavController', function($scope, FilterFactory, $routeParams, $window, UserFactory, UserData, $route) {

	let currentUser = null;

	$scope.goLoginPage = () => {
		$window.location.href = '#!/login';
	};

	$scope.searchFilter = FilterFactory;

	UserFactory.isAuthenticated()
	.then( (user) => {
	  currentUser = UserFactory.getUser();
	});

	$scope.logOut = () => {
		UserFactory.logoutUser()
		.then( (data) => {
			currentUser = null;
			$window.location.href = '#!/';
		});
	};

	//checks for a current user for use with ng-show
	$scope.userCheck = () => {
		if(currentUser) {
			return true;
		} else {
			return false;
		}
	};

	//checks if on the gamelist view for use with ng-show
	$scope.gameListCheck = () => {
		if($route.current.loadedTemplateUrl === 'partials/game-list.html') {
			return true;
		} else {
			return false;
		}
	};
});
