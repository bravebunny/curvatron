var Endless = function (game) {
	this.sp = true;
	this.game = game;
	this.player = null;
	leaderboardID = modesLB[1];
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
		return this.player.trailArray.length;
	},

	getHighScore: function () {
		return localStorage.getItem("survivalScore");
	},

	setHighScore: function (score) {
		localStorage.setItem("survivalScore", score);
	}, 

	submitScore: function () {
		var params = Cocoon.Social.ScoreParams;
		var score = this.getScore();
		if (score > this.getHighScore()) {
			this.setHighScore(score);
		}
		params.leaderboardID = this.leaderboardID;
		if (mobile && socialService && socialService.isLoggedIn()) {
			socialService.submitScore(score, null, params);
		}
	},

};