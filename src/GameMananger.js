var gameMananger = function(game) {}

gameMananger.prototype = {

	preload: function() {
		console.log("ASga")
		groupPlayers = this.game.add.group();

		player1 = new Player(1, 100, 380, Phaser.Keyboard.A, groupPlayers);
		player1.preload();

		player2 = new Player(2, 1000, 380, Phaser.Keyboard.L, groupPlayers);
		player2.preload();
	},

	create: function() {
		console.log("Create")
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 0;

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