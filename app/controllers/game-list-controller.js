'use strict';

patchNotesApp.controller('SteamController', function($scope, $routeParams, FilterFactory, $route, $window, SteamIdFactory, UserFactory, UserData, GameFactory) {

	$scope.games = [];
	$scope.allGames = [];
	let userGamesToDisplay = [];
	let currentUser = null;
	$scope.searchFilter = FilterFactory;

	UserFactory.isAuthenticated()
	.then( (user) => {
	  currentUser = UserFactory.getUser();
	});

	$scope.isUserIn = () => {
		if(currentUser) {
			return true;
		} else {
			return false;
		}
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

	let removeGamesFromList = (arrOfGames) => {
		let updatedGames;
		let savedGamesIds = [];
		let savedGames = [];
		return new Promise( (resolve, reject) => {
			UserData.getGames(currentUser)
				.then( (games) => {
					let gamesToCheckFor = Object.values(games);
					let idsToRemove = gamesToCheckFor.map( (game) => {
						if(game.removed === true) {
							return game.appid;
						} else {
							savedGamesIds.push(game.appid);
							return game.appid;
						}
					});
					let savedGamesFullInfo = arrOfGames.filter( (game) => {
						if(savedGamesIds.indexOf(game.appid) >= 0) {
							return game;
						}
					});
					let updatedGames = arrOfGames.filter( (game) => {
						if(idsToRemove.indexOf(game.appid) === -1) {
							return game;
						}
					});
					let finalGameList = savedGamesFullInfo.concat(updatedGames);
					resolve(finalGameList);
				});
			});
	};

	let narrowGamesForDOM = (arrOfGames) => {
		let narrowedGames;
		return new Promise( (resolve, reject) => {
			removeGamesFromList(arrOfGames)
			.then( (updatedGames) => {
				narrowedGames = updatedGames.slice(0, 20);
				resolve(narrowedGames);
			});
		});
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
			if(Object.values(steamID.data).length === 0 && currentUser) {
				let steamIdObj = {
					uid: currentUser,
					steamid: steamId
				};
				UserData.postSteamId(steamIdObj)
				.then( (postData) => {
				});
			}
		});
	};

	//grabs the games that will be displayed in the DOM
	//authenticates steam ID/vanityURL throws alert if done incorrectly
	let fetchSteamGames = (steamProfileName) => {
		SteamIdFactory.getSteamId(steamProfileName)
		.then( (data) => {
			if(data) {
				saveSteamId(data);
				return GameFactory.getOwnedGames(data);
			} else {
				saveSteamId(steamProfileName);
				return GameFactory.getOwnedGames(steamProfileName)
				.catch( (err) => {
					$window.location.href = '#!/';
				});
			}
		})
		.then( (games) => {
			if (games) {
				userGamesToDisplay = [];
				$scope.allGames = games.games;
				getRecentGames(games);
				getPlayedGames(games);
				narrowGamesForDOM(userGamesToDisplay)
				.then( (narrowedGames) =>{
					addBannerToObj(narrowedGames);
					$scope.games = narrowedGames;
				});
			} else {
				$window.alert("Please Enter Valid Vanity URL name or Steam ID");
			}
		});
	};

	$scope.hideClickedGame = (appid) => {
		UserData.getGames(currentUser)
		.then( (gamesdata) => {
			let gamesToMatch = Object.values(gamesdata).filter( (game) => {
				return game.appid == appid;
			});
			let newProp = {removed: true};
			if(gamesToMatch.length > 0) {
				for(let key in gamesdata) {
					if(gamesdata[key].appid == gamesToMatch[0].appid) {
						UserData.patchGame(key, newProp)
						.then( (data) => {
							fetchSteamGames($routeParams.steamname);
						});
					}
				}
			} else {
				let removedGame = {
					uid: currentUser,
					appid: appid,
					removed: true
				};
				UserData.postGame(removedGame)
				.then( (data) => {
					fetchSteamGames($routeParams.steamname);
				});
			}
		});
	};

	$scope.resetRemoved = () => {
		UserData.getGames(UserFactory.getUser())
		.then( (games) => {
			let keysToRemove = [];
			for(let key in games) {
				if(games[key].removed === true) {
					keysToRemove.push(key);
				}
			}
			keysToRemove.map( (gameId) => {
				UserData.deleteGame(gameId)
				.then( (data) => {
					fetchSteamGames($routeParams.steamname);
				});
			});

		});
	};

	fetchSteamGames($routeParams.steamname);

	$scope.appid = "";

});

