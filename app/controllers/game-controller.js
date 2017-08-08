'use strict';

patchNotesApp.controller('PatchNotesController', function($scope, $rootScope, $routeParams, $window, GameData, GameFactory) {

	let self = this;
	console.log("this", this);

	self.gameData = GameData.games;

	// /update|fix|expansion|build|patch|.0|.1|.2|.3|.4|.5|.6|.7|.8|.9/i

	// $scope.patchFilter = PatchFilter;
	// $scope.tags = ["update", "fix", "expansion", "build", "patch", ".0", ".1", ".2", ".3", ".4", ".5", ".6", ".7", ".8", ".9"];

	$scope.filterFn = function(news) {
	    // Do some tests
	    if(news.title.search(/update|fix|expansion|build|patch|\.0|\.1|\.2|\.3|\.4|\.5|\.6|\.7|\.8|\.9/i) >= 0) {
	        return true; // this will be listed in the results
	    }
	    return false; // otherwise it won't be within the results
	};

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

	// TODO: expand bbcode search terms; also change [h1] to <h1> and remove [/*]
	let parseBBCode = (newsArray) => {
		let parsedCode = newsArray.map( (newsObj) => {
			if (newsObj.contents.search(/\[img]|\[b]|\[\*]|\[url|\[list]/g) >= 0) {
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

	$rootScope.gameObj = {};

	let displayPatchNotes = () => {
		let appId = $routeParams.appid;
		GameFactory.getGameBanner(appId)
		.then( (banner) => {
			$rootScope.gameObj.banner = banner;
		});
		GameFactory.getGameNews($routeParams.appid)
		.then( (newsArray) => {
			$rootScope.gameNews = parseBBCode(newsArray);
		});
	};

	let changeDateFormat = (gameObj) => {

	};

	displayPatchNotes();

	//match id from route params to self object and pull news
});
