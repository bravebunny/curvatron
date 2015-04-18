var Normal = function(game) {
	this.sp = true;
	this.game = game;
	this.spawnPowers = true;
	this.leaderboardID = modesLB[0];
	this.shrinkFreq = 5;
	this.obstacleGroup = null;
	this.cellSize = 64;
	this.rows = Math.floor(h2*1.9/this.cellSize);
	this.columns = Math.floor(w2*1.9/this.cellSize);
	this.marginX = (2*w2 - this.columns*this.cellSize + this.cellSize)*0.5;
	this.marginY = (2*h2 - this.rows*this.cellSize + this.cellSize)*0.5;
};

Normal.prototype = {

	preload: function () {	
		this.game.load.image('point', 'assets/point.png');
		this.game.load.image('player0', 'assets/playerSingle.png');
		this.game.load.image('trail0', 'assets/trailSingle.png');
		this.game.load.image('superPower', 'assets/powerHS.png');
		this.game.load.image('obstacle', 'assets/obstacle.png');
		this.game.load.spritesheet('shrink', 'assets/shrink.png', 100, 100);
	},

	create: function() {
		this.score = 0;
		this.obstacleGroup = this.game.add.group();
		this.pointsPow = [];
		this.pointsObs = [];
		this.lastPoint = null;
		this.player = players[0];
		this.shrink = null;

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
		if (power.name == "point") {
			this.size += this.growth;

		} else if (power.name == "shrink") {
			this.shrink = true;
			this.size = this.initialSize;
		}

		var point = this.lastPoint;
		if (point) {
			this.pointsPow.push(point);
			this.pointsPow = shuffleArray(this.pointsPow);
			
			if (point.x % 2 == 0 && point.y % 2 == 0) {
				this.pointsObs.push(point);
				this.pointsObs = shuffleArray(this.pointsObs);
			}

			if (this.getScore() % 5 == 4) {
				this.player.growth += 2;
			}
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

		if(power.name == 'shrink'){

			if (!this.gridIsFull()) {
				this.createObstacle();
			}
			if (!this.gridIsFull()) {
				this.createObstacle();
			}

			this.shrink = null;
		}

	},

	gridIsFull: function () {
		return (!this.pointsObs[0]);
	},

	createPower: function (type) {
		var collidesWithPlayer = true;

		while (collidesWithPlayer) {
			collidesWithPlayer = false;

			this.lastPoint = this.pointsPow.pop();
			var x = (this.lastPoint.x)*this.cellSize + this.marginX;
			var y = (this.lastPoint.y)*this.cellSize + this.marginY;

			var collSize = 16*scale;
			for (var j = 0; j < this.player.trailArray.length; j++) {
				var curTrail = this.player.trailArray[j];
				if (curTrail && curTrail.x-collSize < x && curTrail.x+collSize > x &&
				 	curTrail.y-collSize < y && curTrail.y+collSize > y) {
					collidesWithPlayer = true;
					var point = this.lastPoint;
					this.pointsPow.push(point);
					this.pointsPow = shuffleArray(this.pointsPow);
					break;
				}
			}
		}

		var powerup = new PowerUp(this.game, type, this, x, y);
		if(type == "shrink"){
			this.shrink = powerup;
		}
		powerup.create();
		
		for (var i = 0; i < this.pointsObs.length; i++) {
			if (JSON.stringify(this.pointsObs[i]) === JSON.stringify(this.lastPoint)) {
				this.pointsObs.splice(i, 1);
				break;
			}
		}
	},

	createObstacle: function (){
		points = this.pointsObs.pop();

		var x = points.x*this.cellSize + this.marginX;
		var y = points.y*this.cellSize + this.marginY;

		/*var x = rx*this.cellSize*2-w2*0.05;
		var y = ry*this.cellSize*2-h2*0.05;*/

		var obstacle = this.game.add.sprite(x, y, 'obstacle');
		var tweenObstacle = this.game.add.sprite(x, y, 'obstacle');
		obstacle.scale.set(1.5);
		obstacle.alpha = 0;
		obstacle.anchor.setTo(.5,.5);
		tweenObstacle.anchor.setTo(.5,.5);
		tweenObstacle.scale.set(0.5);
		tweenObstacle.alpha = 0.0;

		var obstacleTween1 = this.game.add.tween(obstacle.scale).to( {x:0.5, y:0.5}, 4000, Phaser.Easing.Quadratic.In, true);
		var obstacleTween2 = this.game.add.tween(obstacle).to( { alpha: 0.25 }, 2000, Phaser.Easing.Linear.None, true);
		var obstacleTween3 = this.game.add.tween(tweenObstacle.scale).to( {x:1, y:1}, 1000, Phaser.Easing.Linear.None, false);
		var obstacleTween4 = this.game.add.tween(tweenObstacle).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, false);
		obstacleTween1.onComplete.add( function () {
			obstacle.alpha = 0.5;
			tweenObstacle.alpha = 0.5;
			obstacleTween3.start();
			obstacleTween4.start();
			this.game.physics.enable(obstacle, Phaser.Physics.ARCADE);
		}, this);	
		this.obstacleGroup.add(obstacle);
		
		for (var i = 0; i < this.pointsPow.length; i++) {
			if (JSON.stringify(this.pointsPow[i]) === JSON.stringify(points)) {
				this.pointsPow.splice(i, 1);
				break;
			}
		}
	},

	pause: function() {
		if (this.shrink && this.shrink.sprite && this.shrink.sprite.animations) {
			this.shrink.sprite.animations.paused = true;
		}
		
	},

	unPause: function() {
		if (this.shrink && this.shrink.sprite && this.shrink.sprite.animations) {
			this.shrink.sprite.animations.paused = false;
		}
		
	},

	render: function() {
    // call renderGroup on each of the alive members
    this.obstacleGroup.forEachAlive(this.renderGroup, this);
	},

	renderGroup: function(member) {
    this.game.debug.body(member);
	}

};