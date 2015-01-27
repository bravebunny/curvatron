var Player = function(id, x, y, key, game) {
	this.game = game;
	this.player = null;
	this.size = 2;
	this.direction = 1;
	this.id = id;
	this.x = x;
	this.y = y;
	this.key = key;
	this.killTrail = false;
	this.ready = false;
	this.dead = false;
	this.groupTrail = null;
};

Player.prototype = {

	preload: function() {
		console.log(this.game)
		this.groupTrail = this.game.add.group();
		this.game.load.image('player' + this.id, 'assets/player' + this.id + '.png');
		this.game.load.image('trail' + this.id, 'assets/trail' + this.id + '.png');
	},

	create: function() {
		this.player = this.game.add.sprite(this.x, this.y, 'player' + this.id);
		this.player.anchor.setTo(.5,.5);
		groupPlayers.add(this.player);

		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.groupTrail.enableBody = true;
    //this.groupTrail.physicsBodyType = Phaser.Physics.ARCADE;
	},

	update: function() {
		this.game.physics.arcade.collide(groupPlayers, this.groupTrail, this.kill, null, this);

		this.player.body.angularVelocity = this.direction*200;
		this.game.physics.arcade.velocityFromAngle(this.player.angle, 300, this.player.body.velocity);

		if (this.ready) {
			var trailPiece = this.groupTrail.create(this.player.x, this.player.y, 'trail' + this.id);
			trailPiece.body.immovable = true;
			trailPiece.anchor.setTo(.5,.5);
		}
		
		if(this.dead){
			this.killTrail = true;
			this.ready = false;
			//getAt() returns -1 if the object doesn't exist
			var obj = this.groupTrail.getAt(this.groupTrail.length - 1);
			if (obj != -1)
	    {
	    	console.log(obj)
	        obj.kill();
	        obj.parent.removeChild(obj);
	    }
		}


		if(this.killTrail){
			//getFirstAlive() returns null if the object doesn't exist
			var obj = this.groupTrail.getFirstAlive();
	    if (obj)
	    {
	        obj.kill();
	        obj.parent.removeChild(obj);
	    }
		}


		//game.input.onDown.add(this.click, this);
		this.game.input.keyboard.addKey(this.key).onDown.add(this.keyPressed, this);

	},


	keyPressed: function() {
		this.direction *= -1;

		if (!this.ready) {
			this.game.time.events.add(Phaser.Timer.SECOND * 3, function(){this.killTrail = true;}, this);
			this.ready = true;
		}
	},

	kill: function(player, trail) {
		player.kill();
		this.dead = true;
	},

	render: function(){
	}
};