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

		this.game.physics.startSystem(Phaser.Physics.ARCADE)

		//this.game.world.setBounds(0, 0, this.width, this.height);
		this.game.width = this.width;
		this.game.height = this.height;
		this.game.canvas.width = this.width;
		this.game.canvas.height = this.height;
		this.game.world.width = this.width;
		this.game.world.height = this.height;
		this.game.stage.width = this.width;
		this.game.stage.height = this.height;
		this.game.scale.refresh();

		console.log(this.game.world.width)
		console.log(this.game.world.height)

		this.score = 0;
		spawnPowers = true;

		this.map = this.game.add.tilemap('level1'); // Preloaded tilemap
		this.map.addTilesetImage('Pastel'); // Preloaded tileset

    this.layer = this.map.createLayer('obstacles');  //layer[0]

		this.map.setCollisionByExclusion([], true, this.layer);

    //this.layer.resizeWorld();


	},

	update: function() {
		console.log("Update")
		 if(this.game.physics.arcade.collide(players[0].sprite, this.layer)){
		 	console.log("COLIIIIIIIIIIII")
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
		/*var params = Cocoon.Social.ScoreParams;
		if (this.score > this.getHighScore()) {
			this.setHighScore(this.score);
		}
		params.leaderboardID = this.leaderboardID;
		if (mobile && socialService && socialService.isLoggedIn()) {
			socialService.submitScore(this.score, null, params);
		}*/
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