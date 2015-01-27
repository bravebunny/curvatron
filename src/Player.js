var Player = function() {
	this.player = null;
};

Player.prototype = {

	preload: function() {
		game.load.image('player', 'assets/player.png');
	},

	create: function() {
		this.player = game.add.sprite(500, 500, 'player');
		this.player.anchor.setTo(.5,.5);

		game.physics.enable(this.player, Phaser.Physics.ARCADE);
	},

	update: function() {
		this.player.body.angularVelocity = 300;
		game.physics.arcade.velocityFromAngle(this.player.angle, 300, this.player.body.velocity);
	},

	render: function(){
	}
};