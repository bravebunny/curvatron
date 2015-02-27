var Normal = function(game) {
	this.game = game;
	this.spawnPowers = true;
	this.leaderboardID = 'CgkIr97_oIgHEAIQCQ';
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
		return highScore;
	},

	getHighScore: function () {
		return bestScore;
	},

	setScore: function (score) {
		highScore = score;
	},

	setHighScore: function (score) {
		bestScore = score;
	},

	submitScore: function () {
		var params = Cocoon.Social.ScoreParams;
		if (highScore > bestScore) {
			bestScore = highScore;
			localStorage.setItem("highScore", highScore);
		}
		params.leaderboardID = this.leaderboardID;
		if (mobile && socialService && socialService.isLoggedIn()) {
			socialService.submitScore(highScore, null, params);
		}
	},

	collect: function (player, power) {
		highScore++;
		var powerup = new PowerUp(this.game, 'point');
		powerup.create();

		if (((highScore % 10) == 9) && (highScore > 0)) {
			var powerup = new PowerUp(this.game, "shrink");
			powerup.create();
		}

		ballsScore++;
		localStorage.setItem("ballsScore", ballsScore);

		if ((nextBallHigh == 0) && (highScore == bestScore-1)) {
			nextBallHigh = 1;
		}
	}

};