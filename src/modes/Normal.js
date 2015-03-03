var Normal = function(game) {
	this.sp = true;
	this.game = game;
	this.spawnPowers = true;
	this.leaderboardID = modesLB[0];
	this.score = 0;
	this.shrinkFreq = 10;
};

Normal.prototype = {

	preload: function () {	
		this.game.load.image('point', 'assets/point.png');
		this.game.load.image('player0', 'assets/playerSingle.png');
		this.game.load.image('trail0', 'assets/trailSingle.png');
		this.game.load.image('superPower', 'assets/powerHS.png');
		this.game.load.spritesheet('shrink', 'assets/shrink.png', 100, 100);

	},

	create: function() {
		this.score = 0;
		spawnPowers = true;

		var textSize = 15;
  	if (mobile) {
  		textSize = 30
  	}
		powerText = this.game.add.text(0, 0, "1", {
		font: "" + textSize + "px dosis",
      	fill: colorHex,
      	align: "center"
  	});
  	powerText.anchor.setTo(0.5,0.5);

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
		var score = parseInt(localStorage.getItem("highScore"));
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
		
		var highScore = this.getHighScore();

		if (power.name == 'point') {
			this.score++;
			var powerup = new PowerUp(this.game, 'point', this);
			powerup.create();

			if (((this.score % this.shrinkFreq) == this.shrinkFreq-1) && (this.score > 0)) {
				var powerup = new PowerUp(this.game, "shrink", this);
				powerup.create();
			}
		}



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