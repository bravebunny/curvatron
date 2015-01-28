var Player = function(id, x, y, key, game) {
	this.game = game;
	this.player = null;
	this.score = 0;
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
	this.growth = 30;
	this.frameCount = 0;
	this.lastTrailLength = 0;
	this.enemyTrails = [];
};

Player.prototype = {

	create: function() {
		this.groupTrail = this.game.add.group();
		this.player = this.game.add.sprite(this.x, this.y, 'player' + this.id);
		this.player.anchor.setTo(.5,.5);
		groupTrails.push(this.groupTrail);

		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.setSize(16*this.game.world.scale.x, 16*this.game.world.scale.x, 0, 0);
		this.groupTrail.enableBody = true;
    //this.groupTrail.physicsBodyType = Phaser.Physics.ARCADE;
    this.lastTrailLength = this.growth;

	},

	update: function() {
		this.frameCount = (this.frameCount + 1) % 1/(this.speed*this.game.world.scale.x);

		this.game.physics.arcade.overlap(this.player, this.enemyTrails, this.kill, null, this);
		this.game.physics.arcade.overlap(this.player, groupPowers, this.collect, null, this);
		
		//Snake movement
		this.player.body.angularVelocity = this.direction*200*this.angularVelocity*this.speed;
		this.game.physics.arcade.velocityFromAngle(this.player.angle, 300*this.speed, this.player.body.velocity);


		//Create trail
		if (this.ready && this.frameCount == 0) {
			var trailPiece = this.groupTrail.create(this.player.x, this.player.y, 'trail' + this.id);
			trailPiece.body.immovable = true;
			trailPiece.anchor.setTo(.5,.5);
			trailPiece.body.setSize(16*this.game.world.scale.x, 16*this.game.world.scale.x, 0, 0);
		}
		
		//erase trail from behind
		if(this.dead && this.frameCount == 0){
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

		if (!this.killTrail && (this.groupTrail.length >= (this.lastTrailLength + this.growth))) {
			this.killTrail = true;
			this.lastTrailLength = this.groupTrail.length;
		}

		//erase trail from front
		if(this.killTrail && this.frameCount == 0){

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

	kill: function(player, trail) {
		this.player.kill();
		this.dead = true;

		console.log('Player ' + this.id + 'collided with ' + trail.frameName)
	},

	collect: function(player, power) {
		power.kill();
		this.killTrail = false;
		this.growth = 30*power.scale.x;
		this.score = this.score + power.scale.x;
		console.log("palyer" + this.id + " is now " + this.score)

		if (this.score > highScore) {
			highScore = this.score;
			crowned = this.id;
			players[crowned].removeCrown();
			console.log(crowned)
		}

	},

	addCrown: function() {
		this.player.loadTexture('crown' + this.id)
	},

	removeCrown: function() {
		this.player.loadTexture('player' + this.id)
	},

	render: function(){
		this.game.debug.body(this.player);
	}
};