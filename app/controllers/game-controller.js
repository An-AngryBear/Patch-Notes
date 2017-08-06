'use strict';

patchNotesApp.controller('PatchNotesController', function($scope, $rootScope, $routeParams, $window, GameData) {
	let self = this;
	console.log("this", this);

	self.gameData = GameData.games;

	let displayPatchNotes = () => {
		console.log($routeParams.appid);
		let gameNotesToDisplay = self.gameData.filter( (game) => {
			return game.appid == $routeParams.appid;
		});
		$rootScope.gameObj = gameNotesToDisplay[0];
		$rootScope.gameNews = gameNotesToDisplay[0].news;
		console.log(gameNotesToDisplay);
	};

	//TODO:NG-repeat over NEWS hits, not game obj

	//TODO: bbcode parser

	let changeDateFormat = (gameObj) => {

	};

	displayPatchNotes();

	//match id from route params to self object and pull news
});
