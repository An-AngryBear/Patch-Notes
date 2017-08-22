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

	//runs a check for ng-show to see if a user is logged in
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
	//and hasn't been recently played, sorts them in descending order starting with the
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

	//redirects to a game's patch notes
	$scope.goToClickedGame = (appId) =>{
		$window.location.href = `#!/patch-notes/${appId}`;
	};

	//sorts games by priority. 'saved': 1st priority. 'played in last 2 weeks':2nd, 'most hours played': 2nd.
	//removes 'removed' games.
	let sortGames = (arrOfGames) => {
		let updatedGames;
		let savedGamesIds = [];
		let savedGames = [];
		return new Promise( (resolve, reject) => {
			UserData.getGames(currentUser)
				.then( (games) => {
					let idsToRemove = Object.values(games).map( (game) => {
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

	//calls the sorting function and cuts down the top hits to 20
	let narrowGamesForDOM = (arrOfGames) => {
		let narrowedGames;
		return new Promise( (resolve, reject) => {
			sortGames(arrOfGames)
			.then( (updatedGames) => {
				narrowedGames = updatedGames.slice(0, 20);
				resolve(narrowedGames);
			});
		});
	};

	// retrieves game banners to be displayed in DOM
	let addBannerToObj = (arrayOfGameObjs) => {
		let updatedGameObjs = arrayOfGameObjs.forEach( (game) => {
			GameFactory.getGameBanner(game.appid)
				.then( (gameBannerUrl) => {
					game.banner = gameBannerUrl;
				});
		});
	};

	//associates a steam ID witha user
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

	//removes game from DOM on click by adding a 'removed' tag and saving to firebase, then reloading the gamelist.
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

	//deletes all games from database associated with a user that have the property "removed=true", and thus
	//returns them to the DOM if in the top 20 hits.
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

