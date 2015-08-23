var Editor = function(game) {
	this.sp = true;
	this.game = game;
	this.layer = null;
	this.marker = null;
	this.map = null;

};

Editor.prototype = {

	preload: function () {
		setScreenFixed(baseW, baseH, this.game);

		this.game.load.image('point', 'assets/sprites/game/singleplayer/point.png');
		this.game.load.image('player0', 'assets/sprites/game/singleplayer/player.png');
		this.game.load.image('superPower', 'assets/sprites/game/singleplayer/powerHS.png');
		this.game.load.image('obstacle', 'assets/sprites/game/singleplayer/obstacle.png');
		this.game.load.spritesheet('shrink', 'assets/sprites/game/singleplayer/shrink.png', 100, 100);

		this.game.load.image('Pastel', 'assets/levels/Pastel.png'); // loading the tileset image
		this.game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON); // loading the tilemap file
		this.game.load.json('points1', 'assets/levels/points1.json');


	},

	create: function() {
		this.obstacleGroup = this.game.add.group();
		this.lastPoint = null;
		this.player = players[0];

		this.marker = this.game.add.graphics();
    this.marker.lineStyle(2, 0xFFFFFF, 1);
    this.marker.drawRect(0, 0, 24, 24);
		this.marker.lineStyle(2, 0x000000, 1);
		this.marker.drawRect(0, 0, 22, 22);

		this.map = this.game.add.tilemap('level1'); // Preloaded tilemap
		this.map.addTilesetImage('Pastel'); // Preloaded tileset

		this.layer = this.map.createLayer('obstacles'); //layer[0]
		this.map.setCollisionByExclusion([], true, this.layer);
		this.tile = this.map.getTile(0, 0);

		this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

	},

	update: function() {
		this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * 24;
    this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * 24;



		if (this.game.input.mousePointer.isDown) {
      if (this.map.getTile(this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y)) != this.tile) {
          this.map.putTile(this.tile, this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y))
      }
    }

		/*if(this.game.physics.arcade.collide(players[0].sprite, this.layer)){
			players[0].kill();
		}*/
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
