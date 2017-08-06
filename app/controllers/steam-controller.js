'use strict';

patchNotesApp.controller('SteamController', function($rootScope, $scope, $routeParams, $window, SteamIdFactory, GameData, GameFactory) {

	let userGamesToDisplay = [];

	//takes an array of games and filters them out by what the user has played in the
	//last two weeks. sticks them in userGamesToDisplay array
	let getRecentGames = (games) => {
		let arrOfGames = Object.values(games);
		let recentGames = arrOfGames[1].filter( (game) => {
			return game.playtime_2weeks;
		});
		userGamesToDisplay = userGamesToDisplay.concat(recentGames);
	};

	//takes an array of games and filters them out by games the user has over 5 hours in
	//and hasn't been recently played sorts them in descending order starting with the
	//most played game. adds to the userGamesToDisplay array, so as to come *after* the
	//most recently played games
	let getPlayedGames = (games) => {
		let arrOfGames = Object.values(games);
		let playedGames = arrOfGames[1].filter( (game) => {
			if(!game.playtime_2weeks) {
				return game.playtime_forever > 300;
			}
		})
		.sort(function(a, b) {
			return b.playtime_forever - a.playtime_forever;
		});
		userGamesToDisplay = userGamesToDisplay.concat(playedGames);
	};

	$scope.goToClickedGame = (appId) =>{
		console.log(appId);
		$window.location.href = `#!/patch-notes/${appId}`;
	};

	let narrowGamesForDOM = (arrOfGames) => {
		userGamesToDisplay = arrOfGames.slice(0, 16);
	};

	let addNewsAndBannerToObj = (arrayOfGameObjs) => {
		let updatedGameObjs = arrayOfGameObjs.forEach( (game) => {
			GameFactory.getGameNews(game.appid)
				.then( (newsObj) => {
					game.news = newsObj;
					return GameFactory.getGameBanner(game.appid)
				.then( (gameBannerUrl) => {
					game.banner = gameBannerUrl;
				});
			});
		});
	};

	//grabs the games that will be displayed in the DOM
	$scope.fetchSteamGames = (steamProfileName) => {
		SteamIdFactory.getSteamId(steamProfileName)
		.then( (data) => {
			if(data) {
				return GameFactory.getOwnedGames(data);
			} else {
				$window.alert("Please Enter Valid Vanity URL name");
				return null;
			}
		})
		.then( (games) => {
			if (games) {
				getRecentGames(games);
				getPlayedGames(games);
				narrowGamesForDOM(userGamesToDisplay);
				addNewsAndBannerToObj(userGamesToDisplay);
				GameData.games = userGamesToDisplay;
				$rootScope.games = userGamesToDisplay;
				$window.location.href = "#!/game-list";
				console.log("games for DOM", userGamesToDisplay);
			}

		});

	};


	// pass in appid to get news object
	$scope.fetchNews = (appID) => {
		GameFactory.getGameNews(appID)
		.then( (newsHit) => {
			console.log(newsHit);
		});
		GameFactory.getGameBanner(appID)
		.then( (data) => {
			console.log(data);
		});
	};



	$scope.steamURL = "";

	$scope.appid = "";

});

