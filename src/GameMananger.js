var gameMananger = function(game) {}
	
gameMananger.prototype = {

	preload: function() {
		this.game.load.image('power', 'assets/power.png');
		this.game.load.image('player1', 'assets/player1.png');
		this.game.load.image('player2', 'assets/player2.png');
		this.game.load.image('trail1', 'assets/trail1.png');
		this.game.load.image('trail2', 'assets/trail2.png');

		player1 = new Player(1, 100, 380, Phaser.Keyboard.A, this.game);
		player2 = new Player(2, 1000, 380, Phaser.Keyboard.L, this.game);
	},

	create: function() {
		groupPlayers = this.game.add.group();
		groupPowers = this.game.add.group();
		groupTrails = [];

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 0;

		player1.create();
		player2.create();

		this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.createPower, this);

	},

	update: function() {
		player1.update();
		player2.update();
	},

	createPower: function() {
		powerup = new PowerUp(this.game.rnd.integerInRange(10, 1356), this.game.rnd.integerInRange(10, 758), this.game);
		powerup.preload();
		powerup.create();
	},

	render: function(){
	}
};