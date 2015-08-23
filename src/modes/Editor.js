var Editor = function(game) {
	this.sp = true;
	this.game = game;

};

Editor.prototype = {

	preload: function () {
		this.game.load.image('point', 'assets/sprites/game/singleplayer/point.png');
		this.game.load.image('player0', 'assets/sprites/game/singleplayer/playerSingle.png');
		this.game.load.image('superPower', 'assets/sprites/game/singleplayer/powerHS.png');
		this.game.load.image('obstacle', 'assets/sprites/game/singleplayer/obstacle.png');
		this.game.load.spritesheet('shrink', 'assets/sprites/game/singleplayer/shrink.png', 100, 100);
	},

	create: function() {
		this.obstacleGroup = this.game.add.group();
		this.lastPoint = null;
		this.player = players[0];

	},

	update: function() {

	},

	erasesTrail: function () {
		return true;
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

	}

};
