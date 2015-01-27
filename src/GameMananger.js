var GameMananger = function(g) {

	game = g;
	player = null;
};

GameMananger.prototype = {

	preload: function() {
		player = new Player();
		player.preload();

		trail = new Trail();
		trail.preload();
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 0;

		player.create();
		trail.create();
	},

	update: function() {
		player.update();
	},

	render: function(){
	}
};