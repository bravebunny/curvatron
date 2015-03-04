var Normal = function(game) {
	this.sp = true;
	this.game = game;
	this.spawnPowers = true;
	this.leaderboardID = modesLB[0];
	this.score = 0;
	this.shrinkFreq = 1;
	this.obstacleGroup = null;
	this.cellSize = 64;
	this.rows = Math.floor(h2*2/this.cellSize);
	this.columns = Math.floor(w2*2/this.cellSize);
	this.grid = [[]];
	this.pointsPow = [];
	this.pointsObs = [];
	this.lastPoint = null;
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
		this.obstacleGroup = this.game.add.group();

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

  	//create grid points
  	for (var i = 0; i < this.columns; i++) {
			for (var j = 0; j < this.rows; j++) {
				this.pointsPow.push({x: i, y: j});
			}
		}
		this.pointsPow = shuffleArray(this.pointsPow);

  	//create grid points
  	for (var i = 0; i < this.columns*0.5; i++) {
			for (var j = 0; j < this.rows*0.5; j++) {
				this.pointsObs.push({x: i*2, y: j*2});
			}
		}
		this.pointsObs = shuffleArray(this.pointsObs);

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

		if (this.lastPoint) {
			this.pointsPow.push(this.lastPoint);
			this.pointsPow = shuffleArray(this.pointsPow);
		}
		
		var highScore = this.getHighScore();

		if (power.name == 'point') {
			this.score++;
			this.createPower('point');

			//if (((this.score % this.shrinkFreq) == this.shrinkFreq-1) && (this.score > 0)) {
			if (((this.score % this.shrinkFreq) == this.shrinkFreq-1) && (this.score > 0)) {
				this.createPower('shrink')
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

		if(power.name == 'shrink' && !this.gridIsFull()){
			this.createObstacle();
		}

	},

	gridIsFull: function () {
		return (this.pointsObs.length == 0);
	},

	createPower: function (type) {
		this.lastPoint = this.pointsPow.pop();

		var x = (this.lastPoint.x+1)*this.cellSize;
		var y = (this.lastPoint.y+1)*this.cellSize;

		var powerup = new PowerUp(this.game, type, this, x, y);
		powerup.create();

		if (!this.grid[this.lastPoint.x]) {
			this.grid[this.lastPoint.x] = [];
		}
		this.grid[this.lastPoint.x][this.lastPoint.y] = powerup;

	},

	createObstacle: function (){

		var points = this.pointsObs.pop();
		var x = points.x*this.cellSize + this.cellSize;
		var y = points.y*this.cellSize + this.cellSize;

		/*var x = rx*this.cellSize*2-w2*0.05;
		var y = ry*this.cellSize*2-h2*0.05;*/

		var obstacle = this.game.add.sprite(x, y, 'overlay');
		obstacle.scale.set(2);
		obstacle.alpha = 0.5;
		obstacle.anchor.setTo(.5,.5);
		this.game.physics.enable(obstacle, Phaser.Physics.ARCADE);
		this.obstacleGroup.add(obstacle);

		if (!this.grid[points.x]) {
			this.grid[points.x] = [];
		}
		this.grid[points.x][points.y] = obstacle;

		
	},

	render: function() {
    // call renderGroup on each of the alive members
    this.obstacleGroup.forEachAlive(this.renderGroup, this);
},

renderGroup: function(member) {
    this.game.debug.body(member);
}

};