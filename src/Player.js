var Player = function(id, x, y, key) {
	this.player = null;
	this.size = 2;
	this.direction = 1;
	this.id = id;
	this.x = x;
	this.y = y;
	this.key = key;
	this.groupTrail = game.add.group();
	this.killTrail = false;
};

Player.prototype = {

	preload: function() {
		game.load.image('player', 'assets/player' + this.id + '.png');
		game.load.image('trail', 'assets/trail' + this.id + '.png');
	},

	create: function() {
		this.player = game.add.sprite(this.x, this.y, 'player');
		this.player.anchor.setTo(.5,.5);

		game.physics.enable(this.player, Phaser.Physics.ARCADE);

		game.time.events.add(Phaser.Timer.SECOND * 3, function(){this.killTrail = true;}, this);

	},

	update: function() {
		this.player.body.angularVelocity = this.direction*200;
		game.physics.arcade.velocityFromAngle(this.player.angle, 300, this.player.body.velocity);

		this.groupTrail.create(this.player.x, this.player.y, 'trail');
		
		if(this.killTrail){
			var baddie = this.groupTrail.getFirstAlive();
		    if (baddie)
		    {
		        baddie.kill();
		    }
		}

		//game.input.onDown.add(this.click, this);
		game.input.keyboard.addKey(this.key).onDown.add(this.click, this);

	},


	click: function() {
		this.direction *= -1;
	},

	render: function(){
	}
};