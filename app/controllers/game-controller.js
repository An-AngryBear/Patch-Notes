'use strict';

patchNotesApp.controller('PatchNotesController', function($scope, $rootScope, $routeParams, $window, GameData) {

	let self = this;
	console.log("this", this);

	self.gameData = GameData.games;

	// /update|fix|expansion|build|patch|.0|.1|.2|.3|.4|.5|.6|.7|.8|.9/i

	// $scope.patchFilter = PatchFilter;
	// $scope.tags = ["update", "fix", "expansion", "build", "patch", ".0", ".1", ".2", ".3", ".4", ".5", ".6", ".7", ".8", ".9"];

	$scope.filterFn = function(news) {
	    // Do some tests
	    console.log("news?", news);
	    if(news.title.search(/update|fix|expansion|build|patch/i) >= 0) {
	    	console.log("if called?");
	        return true; // this will be listed in the results
	    }
	    return false; // otherwise it won't be within the results
	};

	// TODO: expand bbcode search terms; also change [h1] to <h1> and remove [/*]
	let parseBBCode = (newsArray) => {
		let parsedCode = newsArray.map( (newsObj) => {
			if (newsObj.contents.search(/\[img]|\[b]|\[\*]|\[list]/g) >= 0) {
				console.log("before parse", newsObj);
				var result = XBBCODE.process({
				      text: newsObj.contents,
				      removeMisalignedTags: true,
				      addInLineBreaks: true
				    });
				newsObj.contents = result.html;
			}
			return newsObj;
		});
		return parsedCode;
	};

	let displayPatchNotes = () => {
		console.log($routeParams.appid);
		let gameNotesToDisplay = self.gameData.filter( (game) => {
			return game.appid == $routeParams.appid;
		});
		$rootScope.gameObj = gameNotesToDisplay[0];
		$rootScope.gameNews = parseBBCode(gameNotesToDisplay[0].news);
		console.log($rootScope.gameNews);
	};

	//TODO:NG-repeat over NEWS hits, not game obj

	//TODO: bbcode parser

	let changeDateFormat = (gameObj) => {

	};

	displayPatchNotes();

	//match id from route params to self object and pull news
});
