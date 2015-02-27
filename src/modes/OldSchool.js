var OldSchool = function(game) {
	this.sp = true;
	this.game = game;
	this.nPlayers = -1;
	this.player = null;
	this.spawnPowers = true;
	this.score = 0;
	this.leaderboardID = modesLB[2];
};

OldSchool.prototype = {

	preload: function () {	
		this.game.load.image('player0', 'assets/trailOld.png');
		this.game.load.image('trail0', 'assets/trailOld.png');
		this.game.load.image('superPower', 'assets/powerHS.png');
	},

	create: function() {
		colorHex = '#8eb367';
		colorHexDark = '#475933';
		this.game.stage.backgroundColor = colorHex;
		document.body.style.background = colorHexDark;

		var orientation = Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
		var x, y;
		if (orientation == 'landscape' || !mobile) {
			x = 1.5*w2;
			y = h2;
		} else {
			x = w2;
			y = h2*0.5;
		}
		this.score = 0;
		this.player = new OldPlayer(x, y, this, this.game);
		this.player.create();
		players[0] = this.player;
	},

	update: function() {
		this.player.update();
	},

	erasesTrail: function () {
	},

	getScore: function () {
		return this.score;
	},

	getHighScore: function () {
		var score = parseInt(localStorage.getItem("oldSchool"));
		if (isNaN(score)) {
			return 0;
		} else {
			return score;
		}
	},

	setScore: function (score) {
		this.score = score;
	},

	setHighScore: function (score) {
		localStorage.setItem("oldSchool", score);
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

		var ballsScore = parseInt(localStorage.getItem("ballsScore"));
		if (isNaN(ballsScore)) {
			ballsScore = 0;
		}
		localStorage.setItem("ballsScore", ballsScore+1);

		if ((nextBallHigh == 0) && (this.score == highScore-1)) {
			nextBallHigh = 1;
		}
	}

};