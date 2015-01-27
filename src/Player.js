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
		game.load.image('player' + this.id, 'assets/player' + this.id + '.png');
		game.load.image('trail' + this.id, 'assets/trail' + this.id + '.png');
	},

	create: function() {
		this.player = game.add.sprite(this.x, this.y, 'player' + this.id);
		this.player.anchor.setTo(.5,.5);
		groupPlayers.add(this.player);

		game.physics.enable(this.player, Phaser.Physics.ARCADE);

		game.time.events.add(Phaser.Timer.SECOND * 3, function(){this.killTrail = true;}, this);

		this.groupTrail.enableBody = true;
    //this.groupTrail.physicsBodyType = Phaser.Physics.ARCADE;
	},

	update: function() {
		game.physics.arcade.collide(groupPlayers, this.groupTrail, this.kill, null, this);

		this.player.body.angularVelocity = this.direction*200;
		game.physics.arcade.velocityFromAngle(this.player.angle, 300, this.player.body.velocity);


		var trailPiece = this.groupTrail.create(this.player.x, this.player.y, 'trail' + this.id);
		trailPiece.body.immovable = true;
		
		if(this.killTrail){
			var obj = this.groupTrail.getFirstAlive();
		    if (obj)
		    {
		        obj.kill();
		        obj.parent.removeChild(obj);
		    }
		}

		//game.input.onDown.add(this.click, this);
		game.input.keyboard.addKey(this.key).onDown.add(this.keyPressed, this);

	},


	keyPressed: function() {
		this.direction *= -1;
	},

	kill: function(player, trail) {

		player.kill();
	},

	render: function(){
	}
};