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
	    if(news.title.search(/update|fix|expansion|build|patch|\.0|\.1|\.2|\.3|\.4|\.5|\.6|\.7|\.8|\.9/i) >= 0) {
	        return true; // this will be listed in the results
	    }
	    return false; // otherwise it won't be within the results
	};

	let findAndReplaceExtraBBCode = (news) => {
		let replaced = news.replace(/&#91;/g, "[")
			.replace(/&#93;/g, "]")
			.replace(/\[h1]/g, "<h1>")
			.replace(/\[\/h1]/g, "</h1>")
			.replace(/\[\/\*]/g, "")
			.replace(/\[\/olist\]/g, "</ol>")
			.replace(/\[olist..]/g, "<ol>");
		// newsObj.contents = newsObj.contents.replace(/\[\/h1]/g, "</h1>");
		// newsObj.contents = newsObj.contents.replace(/\[\/\*]/g, "");
		console.log(replaced, "please work");
		return replaced;
	};

	// TODO: expand bbcode search terms; also change [h1] to <h1> and remove [/*]
	let parseBBCode = (newsArray) => {
		let parsedCode = newsArray.map( (newsObj) => {
			console.log("pre filtered", newsObj);
			if (newsObj.contents.search(/\[img]|\[b]|\[\*]|\[url|\[list]/g) >= 0) {
				// console.log("before parse", newsObj);
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
