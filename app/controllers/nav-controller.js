'use strict';

patchNotesApp.controller('NavController', function($scope, $routeParams, $window, UserFactory) {

	$scope.goLoginPage = () => {
		$window.location.href = '#!/login';
	};

	$scope.logOut = () => {
		UserFactory.logoutUser()
		.then( (data) => {
			$window.location.href = '#!/enter-url.html';
		});
	};
});
