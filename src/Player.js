var Player = function(id, x, y, key, game) {
	this.game = game;
	this.player = null;
	this.size = 1;
	this.direction = 1;
	this.id = id;
	this.x = x;
	this.y = y;
	this.key = key;
	this.killTrail = false;
	this.dead = false;
	this.groupTrail = null;
	this.ready = true;
	this.speed = 1;
	this.angularVelocity = 1;
	this.growth = 1;
};

Player.prototype = {

	create: function() {
		this.groupTrail = this.game.add.group();
		this.player = this.game.add.sprite(this.x, this.y, 'player' + this.id);
		this.player.anchor.setTo(.5,.5);
		groupTrails.push(this.groupTrail);

		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.groupTrail.enableBody = true;
    //this.groupTrail.physicsBodyType = Phaser.Physics.ARCADE;
    this.game.time.events.add(Phaser.Timer.SECOND * this.size/this.speed, function(){this.killTrail = true;}, this);


	},

	update: function() {
		this.game.physics.arcade.collide(this.player, groupTrails, this.kill, null, this);
		this.game.physics.arcade.collide(this.player, groupPowers, this.collect, null, this);

		if (!this.player.inCamera) {
			this.kill();
		}

		this.player.body.angularVelocity = this.direction*200*this.angularVelocity*this.speed;
		this.game.physics.arcade.velocityFromAngle(this.player.angle, 300*this.speed, this.player.body.velocity);

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

		this.game.input.onDown.add(this.keyPressed, this);
		this.game.input.keyboard.addKey(this.key).onDown.add(this.keyPressed, this);
	},


	keyPressed: function() {
		this.direction *= -1;
	},

	kill: function() {
		this.player.kill();
		this.dead = true;
	},

	collect: function(player, power) {
		power.kill();
		this.killTrail = false;
		this.game.time.events.add(Phaser.Timer.SECOND * this.growth/this.speed, function(){this.killTrail = true;}, this);
		this.size++;

	},

	render: function(){
	}
};