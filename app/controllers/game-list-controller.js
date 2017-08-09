'use strict';

patchNotesApp.controller('SteamController', function($scope, $routeParams, $window, SteamIdFactory, UserFactory, UserData, GameData, GameFactory) {

	$scope.games = [];
	let userGamesToDisplay = [];
	let currentUser = null;

	UserFactory.isAuthenticated()
	.then( (user) => {
	  console.log("user status", user);
	  currentUser = UserFactory.getUser();
	  console.log("auth?", currentUser);
	});

	$scope.isUserIn = () => {
		if(currentUser) {
			return true;
		} else {
			return false;
		}
	};

	$scope.hideClickedGame = (appid) => {
		let removedGame = {
			uid: currentUser,
			appid: appid,
			removed: true
		};
		UserData.postGame(removedGame)
		.then( (data) => {
			console.log("hiding game", data);
		});
	};

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
		$window.location.href = `#!/patch-notes/${appId}`;
	};

	let narrowGamesForDOM = (arrOfGames) => {
		userGamesToDisplay = arrOfGames.slice(0, 20);
	};

	let addBannerToObj = (arrayOfGameObjs) => {
		let updatedGameObjs = arrayOfGameObjs.forEach( (game) => {
			GameFactory.getGameBanner(game.appid)
				.then( (gameBannerUrl) => {
					game.banner = gameBannerUrl;
				});
		});
	};

	let saveSteamId = (steamId) => {
		UserData.getSteamId(currentUser)
		.then( (steamID) => {
			console.log(Object.values(steamID.data));
			if(Object.values(steamID.data).length === 0 && currentUser) {
				let steamIdObj = {
					uid: currentUser,
					steamid: steamId
				};
				UserData.postSteamId(steamIdObj)
				.then( (postData) => {
					console.log("postData", postData);
				});
			}
		});
	};

	//grabs the games that will be displayed in the DOM
	//authenticates steam ID/vanityURL throws alert if done incorrectly
	let fetchSteamGames = (steamProfileName) => {
		SteamIdFactory.getSteamId(steamProfileName)
		.then( (data) => {
			console.log("hey data", data);
			if(data) {
				saveSteamId(data);
				return GameFactory.getOwnedGames(data);
			} else {
				saveSteamId(steamProfileName);
				return GameFactory.getOwnedGames(steamProfileName)
				.catch( (err) => {
					console.log("Invalid Steam ID/Vanity URL", err);
					$window.location.href = '#!/';
				});
			}
		})
		.then( (games) => {
			if (games) {
				getRecentGames(games);
				getPlayedGames(games);
				narrowGamesForDOM(userGamesToDisplay);
				addBannerToObj(userGamesToDisplay);
				GameData.games = userGamesToDisplay;
				$scope.games = userGamesToDisplay;
				console.log("games for DOM", userGamesToDisplay);
			} else {
				$window.alert("Please Enter Valid Vanity URL name or Steam ID");
			}
		});
	};

	fetchSteamGames($routeParams.steamname);

	$scope.appid = "";

});

