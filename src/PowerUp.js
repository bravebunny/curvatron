var PowerUp = function(game) {
	this.game = game;
	this.sprite = null;
	this.x;
	this.y;
	this.size = 1;
};

PowerUp.prototype = {

	preload: function() {
		this.game.load.image('power', 'assets/power.png');
	},

	create: function() {
		if (numberPlayers > 0) {
			var randNum = this.game.rnd.integerInRange(0, 100);
			if (randNum < 60) {
				this.size = 1;
			} else if (randNum < 80) {
				this.size = 2;
			} else if (randNum < 95) {
				this.size = 3;
			} else {
				this.size = 4;
			}
		} else {
			this.size = 1;
		}

		this.place();

		groupPowers.add(this.sprite);

		if (numberPlayers == 0) {
			powerText.setText(highScore+1);
			powerText.x = this.sprite.x;
			powerText.y = this.sprite.y;
		}


	},

	place: function() {
		this.x = this.game.rnd.integerInRange(32, this.game.world.width/this.game.world.scale.x);
		this.y = this.game.rnd.integerInRange(32, this.game.world.height/this.game.world.scale.y);

		this.sprite = this.game.add.sprite(this.x, this.y, 'power');

		this.sprite.anchor.setTo(.5,.5);
		this.sprite.scale.set(this.size/2);

		this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.body.setSize(64*this.game.world.scale.x, 64*this.game.world.scale.x, 0, 0);

		if (this.game.physics.arcade.overlap(this.sprite, groupTrails, null, null)) {
			this.sprite.kill();
			this.place();
		}
	}
};