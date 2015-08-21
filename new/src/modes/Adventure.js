var Adventure = function(game) {
	this.sp = true;
	this.game = game;
	this.spawnPowers = true;
	this.leaderboardID = modesLB[0];
	this.score = 0;
	this.map = null;
	this.layer = null;
	this.width = 1344;
	this.height = 768;
};

Adventure.prototype = {

	preload: function () {
		this.game.load.image('player0', 'assets/playerSingle.png');
		this.game.load.image('trail0', 'assets/trailSingle.png');
		this.game.load.image('superPower', 'assets/powerHS.png');
		this.game.load.spritesheet('shrink', 'assets/shrink.png', 100, 100);
		this.game.load.image('Pastel', 'assets/level/Pastel.png'); // loading the tileset image
		this.game.load.tilemap('level1', 'assets/level/level1.json', null, Phaser.Tilemap.TILED_JSON); // loading the tilemap file
	},

	create: function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);



		this.game.width = this.width;
		this.game.height = this.height;
		this.game.canvas.width = this.width;
		this.game.canvas.height = this.height;
		this.game.renderer.resize(this.width, this.height);
		this.game.stage.width = this.width;
		this.game.stage.height = this.height;
		this.game.scale.width = this.width;
		this.game.scale.height = this.height;
		this.game.world.setBounds(0, 0, this.width, this.height);
		this.game.camera.setSize(this.width, this.height);
		this.game.camera.setBoundsToWorld();
		this.game.scale.refresh();

		borders = [0, this.game.world.width, 0,this.game.world.height];

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

		this.map = this.game.add.tilemap('level1'); // Preloaded tilemap
		this.map.addTilesetImage('Pastel'); // Preloaded tileset

    this.layer = this.map.createLayer('obstacles'); //layer[0]

		powerText = this.game.add.text(0, 0, "1", {
		font: "15px dosis",
				fill: colorHex,
				align: "center"
		});
		powerText.anchor.setTo(0.5,0.5);

		this.map.setCollisionByExclusion([], true, this.layer);

		this.layer.resizeWorld();

		//players[0].sprite.scale.set((-1/24)*8+7/12);
	},

	update: function() {
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
		var powerup = new PowerUp(this.game, 'point', this);
		powerup.create();

		var ballsScore = parseInt(localStorage.getItem("ballsScore"));
		if (isNaN(ballsScore)) {
			ballsScore = 0;
		}
		localStorage.setItem("ballsScore", ballsScore+1);
	}

};
