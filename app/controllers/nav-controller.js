'use strict';

patchNotesApp.controller('NavController', function($scope, $routeParams, $window, UserFactory, UserData, $route) {

	$scope.goLoginPage = () => {
		$window.location.href = '#!/login';
	};

	$scope.logOut = () => {
		UserFactory.logoutUser()
		.then( (data) => {
			$window.location.href = '#!/enter-url.html';
		});
	};

	$scope.resetRemoved = () => {
		UserData.getGames(UserFactory.getUser())
		.then( (games) => {
			let removedGames = Object.keys(games);
			removedGames.map( (gameId) => {
				UserData.deleteGame(gameId)
				.then( (data) => {
					console.log(data);
					$route.reload();
				});
			});

		});
	};

	$scope.userCheck = () => {
		let currentUser = UserFactory.getUser();
		if(currentUser) {
			return true;
		} else {
			return false;
		}
	};


});
