var PowerUp = function(x, y, game) {
	this.game = game;
	this.sprite = null;
	this.x = x;
	this.y = y;
	this.size = 1;
};

PowerUp.prototype = {

	preload: function() {
		this.game.load.image('power', 'assets/power.png');
	},

	create: function() {
		var randNum = this.game.rnd.integerInRange(0, 100);
		if (randNum < 60) {
			this.size = 0.5;
		} else if (randNum < 80) {
			this.size = 1;
		} else if (randNum < 95) {
			this.size = 2;
		} else {
			this.size = 4;
		}
		this.sprite = this.game.add.sprite(this.x, this.y, 'power');
		this.sprite.anchor.setTo(.5,.5);
		this.sprite.scale.set(this.size);
		groupPowers.add(this.sprite);

		this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.body.setSize(16*this.game.world.scale.x, 16*this.game.world.scale.x, 0, 0);
	}
};