var PowerUp = function(x, y, game) {
	this.game = game;
	this.sprite = null;
	this.x = x;
	this.y = y;
};

PowerUp.prototype = {

	preload: function() {
		this.game.load.image('power', 'assets/power.png');
	},

	create: function() {
		this.sprite = this.game.add.sprite(this.x, this.y, 'power');
		this.sprite.anchor.setTo(.5,.5);
		groupPowers.add(this.sprite);

		this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.body.setSize(16*this.game.world.scale.x, 16*this.game.world.scale.x, 0, 0);
	}
};