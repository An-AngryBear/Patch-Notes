'use strict';

patchNotesApp.controller('PatchNotesController', function($scope, $rootScope, $routeParams, $window, GameData) {
	let self = this;
	console.log("this", this);

	self.gameData = GameData.games;

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
	};

	//TODO:NG-repeat over NEWS hits, not game obj

	//TODO: bbcode parser

	let changeDateFormat = (gameObj) => {

	};

	displayPatchNotes();

	//match id from route params to self object and pull news
});
