'use strict';

patchNotesApp.controller('NavController', function($scope, $routeParams, $window) {

	$scope.goLoginPage = () => {
		$window.location.href = '#!/login';
	};

});
