'use strict';

patchNotesApp.controller('PatchNotesController', function($scope, $routeParams, $window, GameFactory, UserData, UserFactory) {

	let currentUser;
	$scope.gameObj = {};
	$scope.gameNews = [];
	let userOwns = null;

	// if user has current game saved on their account, will stick in an array
	let gameCheck = () => {
		UserData.getGames(currentUser)
		.then( (gamesdata) => {
			userOwns = Object.values(gamesdata).filter( (game) => {
				return game.appid == $routeParams.appid;
			});
		});
	};

	//filters to show news hits based on keywords
	UserFactory.isAuthenticated()
	.then( (user) => {
	  currentUser = UserFactory.getUser();
	  gameCheck();
	});

	// uses keywords to filter through news hits from steam
	$scope.filterFn = function(news) {
	    if(news.title.search(/update|fix|expansion|build|patch|\.0|\.1|\.2|\.3|\.4|\.5|\.6|\.7|\.8|\.9/i) >= 0) {
	        return true;
	    }
	    return false;
	};

	$scope.isUserIn = () => {
		if(currentUser) {
			return true;
		} else {
			return false;
		}
	};

	//check for if the game is saved for use with ng-show
	$scope.doesUserHaveSaved = () => {
		if(userOwns && userOwns.length > 0 && userOwns[0].removed === false) {
			return true;
		} else {
			return false;
		}
	};

	//saves game to firebase associated with the user
	$scope.saveGame = () => {
		UserData.getGames(currentUser)
		.then( (gamesdata) => {
			let gamesToMatch = Object.values(gamesdata).filter( (game) => {
				return game.appid == $routeParams.appid;
			});
			let newProp = {removed: false};
			if(gamesToMatch.length > 0) {
				for(let key in gamesdata) {
					if(gamesdata[key].appid == gamesToMatch[0].appid) {
						UserData.patchGame(key, newProp)
						.then( (data) => {
							gameCheck();
						});
					}
				}
			} else {
				let addGame = {
					uid: currentUser,
					appid: parseInt($routeParams.appid),
					removed: false
				};
				UserData.postGame(addGame)
				.then( (data) => {
					gameCheck();
				});
			}
		});
	};

	//removes the game from firebase
	$scope.removeFromSaved = () => {
		UserData.getGames(currentUser)
		.then( (gamesdata) => {
			for(let key in gamesdata) {
				if(gamesdata[key].appid == $routeParams.appid) {
					UserData.deleteGame(key)
					.then( (data) => {
						userOwns = null;
					});
				}
			}
		});
	};

	//cleans up all left over BBCode
	let findAndReplaceExtraBBCode = (news) => {
		let replaced = news.replace(/&#91;/g, "[")
			.replace(/&#93;/g, "]")
			.replace(/\[h1]/gi, "<h1>")
			.replace(/\[\/h1]/gi, "</h1>")
			.replace(/\[\/\*]/g, "")
			.replace(/\[\/olist\]/gi, "</ol>")
			.replace(/\[olist..]/gi, "<ol>");
		return replaced;
	};

	//converts BBCode from the API to HTML
	let parseBBCode = (newsArray) => {
		let parsedCode = newsArray.map( (newsObj) => {
			if (newsObj.contents.search(/\[img]|\[b]|\[\*]|\[url|\[list]/gi) >= 0) {
				var result = XBBCODE.process({
				      text: newsObj.contents,
				      removeMisalignedTags: true,
				      addInLineBreaks: true
				    });
				let filteredResult = findAndReplaceExtraBBCode(result.html);
				newsObj.contents = filteredResult;
			}
			return newsObj;
		});
		return parsedCode;
	};

	//loads game news on banner, based on the appid in route parameters
	let displayPatchNotes = () => {
		let appId = $routeParams.appid;
		GameFactory.getGameBanner(appId)
		.then( (banner) => {
			$scope.gameObj.banner = banner;
		});
		GameFactory.getGameNews($routeParams.appid)
		.then( (newsArray) => {
			$scope.gameNews = parseBBCode(newsArray);
		});
	};

	let changeDateFormat = (gameObj) => {

	};

	displayPatchNotes();

});
