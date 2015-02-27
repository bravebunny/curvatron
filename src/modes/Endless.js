var Endless = function (game) {
	this.sp = true;
	this.game = game;
	this.player = null;
	leaderboardID = 'CgkIr97_oIgHEAIQCg';
};

Endless.prototype = {

	preload: function () {
		this.game.load.image('player0', 'assets/playerSingle.png');
		this.game.load.image('trail0', 'assets/trailSingle.png');
	},

	create: function () {
		this.player = players[0];
	},

	update: function () {

	},

	erasesTrail: function () {
		return !this.player.ready;
	},

	getScore: function () {
		return survivalScore;
	},

	getHighScore: function () {
		return bestSurvScore;
	},

	setScore: function (score) {
		survivalScore = score;
	},

	setHighScore: function (score) {
		bestSurvScore = score;
	}, 

	submitScore: function () {
		var params = Cocoon.Social.ScoreParams;
		survivalScore = this.player.trailArray.length;
		if (survivalScore > bestSurvScore) {
			bestSurvScore = survivalScore;
			localStorage.setItem("survivalScore", survivalScore);
		}
		params.leaderboardID = this.leaderboardID;
		if (mobile && socialService && socialService.isLoggedIn()) {
			socialService.submitScore(survivalScore, null, params);
		}
	},

};