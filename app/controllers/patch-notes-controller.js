'use strict';

patchNotesApp.controller('PatchNotesController', function($scope, $routeParams, $window, GameFactory, UserData) {

	$scope.gameObj = {};
	$scope.gameNews = [];

	//filters to show news hits based on keywords
	$scope.filterFn = function(news) {
	    if(news.title.search(/update|fix|expansion|build|patch|\.0|\.1|\.2|\.3|\.4|\.5|\.6|\.7|\.8|\.9/i) >= 0) {
	        return true;
	    }
	    return false;
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
