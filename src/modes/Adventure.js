var Adventure = function(game) {
	this.sp = true;
	this.game = game;
	this.spawnPowers = true;
	this.map = null;
	this.layer = null;
	this.width = 1344;
	this.height = 768;
	this.level = 1;
};

Adventure.prototype = {

	init: function (level) {
		this.level = level;
	},

	preload: function () {
		setScreenFixed(baseW, baseH, this.game);

		this.game.load.image('player0', 'assets/sprites/game/singleplayer/player.png');
		this.game.load.image('superPower', 'assets/sprites/game/singleplayer/powerHS.png');
		this.game.load.image('point', 'assets/sprites/game/singleplayer/point.png');
		this.game.load.spritesheet('shrink', 'assets/sprites/game/singleplayer/shrink.png', 100, 100);

		this.game.load.image('Pastel', 'assets/levels/Pastel.png'); // loading the tileset image
		this.game.load.tilemap('blank', 'assets/levels/blank.json', null, Phaser.Tilemap.TILED_JSON); // loading the tilemap file

	},

	create: function() {
		//varialbes that need to be reset on startup
		this.score = 0;
		this.pointPositions = [];

		//redo bitmapData
		delete bmd;
		bmd = this.game.add.bitmapData(this.game.width, this.game.height);
		bmd.addToWorld();
		bmd.smoothed = false;

		w2 = this.game.world.width/2;
		h2 = this.game.world.height/2;

		bmd.width = 2*w2;
		bmd.height = 2*h2;

		players[0].x = w2;
		players[0].y = h2;

		this.score = 0;
		spawnPowers = true;

		this.map = this.game.add.tilemap('blank');
		this.map.addTilesetImage('Pastel'); // Preloaded tileset

		var levelArray = this.game.cache.getJSON('level');
		console.log(levelArray)

		for (var x = 0; x < this.map.width; x++) {
			for (var y = 0; y < this.map.height; y++) {
				if (levelArray[x][y] == 1) this.map.putTile(0, x, y);
				else if (levelArray[x][y] > 1) {
					this.pointPositions[levelArray[x][y] - 2] = {};
					var point = this.pointPositions[levelArray[x][y] - 2];
					point.x = x*24-12;
					point.y = y*24-12;

				}
			}
		}

    this.layer = this.map.createLayer('obstacles'); //layer[0]

		powerText = this.game.add.text(0, 0, "1", {
		font: "15px dosis",
				fill: colorHex,
				align: "center"
		});
		powerText.anchor.setTo(0.5,0.5);

		this.map.setCollisionByExclusion([], true, this.layer);
	},

	update: function () {
		if(this.game.physics.arcade.collide(players[0].sprite, this.layer)){
			players[0].kill();
		}
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
		if (this.score > this.getHighScore()) {
			this.setHighScore(this.score);
		}
	},

	collect: function (player, power) {

		this.score++;

		if (this.score >= this.pointPositions.length) {
			this.nextLevel();
		} else {
			this.createPower();
		}

		if (this.score >= this.pointPositions.length-2) {
			nextBallHigh = 1;
		}

		var ballsScore = parseInt(localStorage.getItem("ballsScore"));
		if (isNaN(ballsScore)) {
			ballsScore = 0;
		}
		localStorage.setItem("ballsScore", ballsScore+1);
	},

	createPower: function () {
		var powerup = new PowerUp(this.game, 'point', this, this.pointPositions[this.score].x, this.pointPositions[this.score].y);
		powerup.create();
	},

	nextLevel: function () {
		var mode = new Adventure(this.game, this.level+1);
		this.game.state.start("PreloadGame", true, false, mode, this.level+1);
	}

};
