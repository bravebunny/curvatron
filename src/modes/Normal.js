var Normal = function(game) {
	this.sp = true;
	this.game = game;
	this.spawnPowers = true;
	this.leaderboardID = modesLB[0];
	this.score = 0;
};

Normal.prototype = {

	preload: function () {	
		this.game.load.image('player0', 'assets/playerSingle.png');
		this.game.load.image('trail0', 'assets/trailSingle.png');
		this.game.load.image('superPower', 'assets/powerHS.png');
		this.game.load.spritesheet('shrink', 'assets/shrink.png', 100, 100);
		
	},

	create: function() {

		spawnPowers = true;


	},

	update: function() {

	},

	erasesTrail: function () {
		return true;
	},

	getScore: function () {
		return this.score;
	},

	getHighScore: function () {
		return parseInt(localStorage.getItem("highScore"));
	},

	setScore: function (score) {
		this.score = score;
	},

	setHighScore: function (score) {
		localStorage.setItem("highScore", score);
	},

	submitScore: function () {
		var params = Cocoon.Social.ScoreParams;
		if (this.score > this.getHighScore()) {
			this.setHighScore(this.score);
		}
		params.leaderboardID = this.leaderboardID;
		if (mobile && socialService && socialService.isLoggedIn()) {
			socialService.submitScore(this.score, null, params);
		}
	},

	collect: function (player, power) {
		this.score++;
		var highScore = this.getHighScore();
		var powerup = new PowerUp(this.game, 'point', this);
		powerup.create();

		if (((highScore % 10) == 9) && (highScore > 0)) {
			var powerup = new PowerUp(this.game, "shrink", this);
			powerup.create();
		}

		var ballsScore = parseInt(localStorage.getItem("ballsScore")) + 1;
		localStorage.setItem("ballsScore", ballsScore);

		if ((nextBallHigh == 0) && (this.score == highScore-1)) {
			nextBallHigh = 1;
		}
	}

};