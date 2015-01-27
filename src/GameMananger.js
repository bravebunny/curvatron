var gameMananger = function(game) {}
	
gameMananger.prototype = {

	preload: function() {
		groupPlayers = this.game.add.group();

		player1 = new Player(1, 100, 380, Phaser.Keyboard.A, this.game);
		player1.preload();

		player2 = new Player(2, 1000, 380, Phaser.Keyboard.L, this.game);
		player2.preload();
	},

	create: function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 0;

		player1.create();
		player2.create();
	},

	update: function() {
		player1.update();
		player2.update();
	},

	render: function(){
	}
};