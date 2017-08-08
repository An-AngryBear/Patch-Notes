'use strict';

patchNotesApp.controller('EnterUrlController', function($scope, $routeParams, $window) {

	$scope.steamURL = "";

	$scope.enterSteamName = () => {
		$window.location.href = `#!/game-list/${$scope.steamURL}`;
	};
});