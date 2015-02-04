var Player = function(id, x, y, key, game) {
	this.game = game;
	this.sprite = null;
	this.score = 0;
	this.direction = 1;
	this.id = id;
	this.x = x;
	this.y = y;
	this.key = key;
	this.killTrail = false;
	this.dead = false;
	this.ready = true;
	this.speed = 1;
	this.angularVelocity = 1;
	this.growth = 30;
	this.frameCount = 0;
	this.lastTrailLength = 0;
	this.keyText = null;
	this.circle = null;
	this.collectSound = null;
	this.paused = false;
	this.textTween = null;
	this.trailArray = [];
	this.trail = null
};

Player.prototype = {

	create: function() {
		this.sprite = this.game.add.sprite(this.x, this.y, 'player' + this.id);
		this.sprite.anchor.setTo(.5,.5);
		this.trail = this.game.make.sprite(0, 0, 'trail' + this.id);
		this.trail.anchor.set(0.5);
		this.trail.scale.set(scale);

		//used to do this in a fancier way, but it broke some stuff
		if(this.y > h2) {
			this.sprite.rotation = Math.PI;
		}

		if (numberPlayers > 0) {
			this.color = Phaser.Color.hexToColor(colorPlayers[this.id]);
		} else {
			this.color = Phaser.Color.hexToColor("#FFFFFF");
		}
		
		this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		//this.sprite.body.setSize(16*scale, 16*scale, 0, 0);
		this.sprite.scale.set(scale);
    this.lastTrailLength = this.growth;

		this.sprite.body.angularVelocity = this.direction*200*this.angularVelocity*this.speed*scale;

		if(mobile){
			this.game.input.onDown.add(this.click, this);
		}
		else if (numberPlayers == 0){
			this.game.input.onDown.add(this.keyPressed, this);
		}
		this.input = this.game.input.keyboard.addKey(this.key).onDown.add(this.keyPressed, this);

	},

	update: function() {
		if (!this.paused && paused) {
			this.paused = true;
			this.pause();
		} else if (this.paused && !paused) {
			this.paused = false;
			this.unpause();
		}

			if (!this.paused) {
			this.game.physics.arcade.velocityFromAngle(this.sprite.angle, 300*this.speed*scale, this.sprite.body.velocity);
			this.sprite.body.angularVelocity = this.direction*200*this.angularVelocity*this.speed;
			this.frameCount = (this.frameCount + 1) % 1/(this.speed*scale);

			if (!this.dead) {
				//collision detection
				var collSize = 16*scale;
				var xx = Math.cos(this.sprite.rotation)*30*scale + this.sprite.x;
				var yy = Math.sin(this.sprite.rotation)*30*scale + this.sprite.y;

				for (var i = 0; i < players.length; i++) {
					for (var j = 0; j < this.trailArray.length; j++) {
						var curTrail = players[i].trailArray[j];
						if (curTrail && curTrail.x-collSize < xx && curTrail.x+collSize > xx &&
							 	curTrail.y-collSize < yy && curTrail.y+collSize > yy) {
							 	this.kill();
						}
					}
				}
			}
			this.game.physics.arcade.overlap(this.sprite, groupPowers, this.collect, null, this);
			for (var i = 0; i < players.length; i++) {
				if (i != this.id) {
					this.game.physics.arcade.overlap(this.sprite, players[i].sprite, this.kill, null, this);
				}
			}

			var trailPiece = null;
			var ctx = bmd.context;

			//Create trail
			if (this.ready && this.frameCount == 0 && !this.dead) {
				trailPiece = {"x": this.sprite.x,"y": this.sprite.y, "n": 1};
				this.trailArray.push(trailPiece);
				bmd.draw(this.trail, this.sprite.x, this.sprite.y);
			}

			//erase trail from front
			if(this.dead && this.frameCount == 0 && this.trailArray[0]){
				trailPiece = this.trailArray.pop();;
		    ctx.clearRect(trailPiece.x-10*scale, trailPiece.y-10*scale, 20*scale, 20*scale);
				
				if (this.trailArray.length > 0) {
					trailPiece = this.trailArray[this.trailArray.length -1];
					bmd.draw(this.trail, trailPiece.x, trailPiece.y);
				}
			}

			if (!this.killTrail && (this.trailArray.length >= (this.lastTrailLength + this.growth))) {
				this.killTrail = true;
				this.lastTrailLength = this.trailArray.length;
			}

			//erase trail from behind
			if(this.killTrail && this.frameCount == 0 && this.trailArray[0]){
				trailPiece = this.trailArray.shift();
				ctx.clearRect(trailPiece.x-10*scale, trailPiece.y-10*scale, 20*scale, 20*scale);
				
				if (this.trailArray.length > 0) {
					bmd.draw(this.trail, this.trailArray[0].x, this.trailArray[0].y);
				}
			}

			//Screen border collisions
			/*if (numberPlayers > 0) {
				if(((this.sprite.x-16)<=borders[0]) || ((this.sprite.x+16)>=borders[1])){
					this.kill();
				}
				if(((this.sprite.y-16)<=borders[2]) || ((this.sprite.y+16)>=borders[3])){
					this.kill();
				}
			} else {*/
			if((this.sprite.x+8*scale)<=borders[0]) {
				this.sprite.x = borders[1];
			} else if ((this.sprite.x-8*scale)>=borders[1]) {
				this.sprite.x = borders[0];
			}

			if((this.sprite.y+8*scale)<=borders[2]) {
				this.sprite.y = borders[3];
			} else if ((this.sprite.y-8*scale)>=borders[3]) {
				this.sprite.y = borders[2];
			}
			/*}*/
		}
		//Show player's key
		if (!this.keyText) {
			this.keyText = this.game.add.text(
			Math.round(Math.cos(this.sprite.rotation + Math.PI/2)*88*scale) + this.x,
			Math.round(Math.sin(this.sprite.rotation + Math.PI/2)*88*scale) + this.y,
			String.fromCharCode(this.key), {
		        font: "80px Dosis Extrabold",
		        fill: "#ffffff",
		        align: "center"});
			this.keyText.scale.set(scale);
	  		this.keyText.anchor.setTo(0.5,0.5);

		  	if (mobile) {
		  		this.keyText.setText(bestScore);
		  	}
		}

	},


	keyPressed: function() {

		if(gameOver && numberPlayers == 0 && this.game.input.onDown.active){
			gameOver=false;
			this.game.state.restart(true,false,numberPlayers);
		} else if (!this.dead) {
			if (this.direction == 1 && !gameOver) {
				this.direction = -1;
				if(!mute) {
					moveSounds[0].play();
				}
			} else if (!gameOver) {
				this.direction = 1;
				if(!mute) {
					moveSounds[1].play();
				}
			}
			if (this.keyText.alpha == 1) {
				this.textTween = this.game.add.tween(this.keyText).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
				if (numberPlayers == 0 && !mobile) {
					tempLabel = this.game.add.tween(tempLabel).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
					tempLabelText = this.game.add.tween(tempLabelText).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
				}

				if(mobile && pauseSprite.alpha == 1){
					pauseTween = this.game.add.tween(pauseSprite).to( { alpha: 0.1 }, 2000, Phaser.Easing.Linear.None, true);
				}
			}
		}
	},

	click: function(){
		var x1 = w2 - 81 , x2 = w2 + 82,
            y1 = h2 - 81, y2 = h2 + 81;

        if(this.game.input.position.x > x1 && this.game.input.position.x < x2 && this.game.input.position.y > y1 && this.game.input.position.y < y2 ){}
        else{
        	this.keyPressed();
        }
	},

	kill: function() {
		this.keyText.destroy();
		if(!this.dead){
			if(numberPlayers == 0){
				deathScore++;
				localStorage.setItem("deathScore", deathScore);
			}
			this.sprite.kill();
			if(!mute) {
				killSound.play();
			}
			this.dead = true;

			var alreadyDead = 0;
			for (var i = 0; i < players.length; i++) {
				if(players[i].dead){
					alreadyDead++;
				}
			}

			var newMax = 0;
			for (var i = 0; i < players.length; i++) {
				if (players.length - alreadyDead == 1 && i != this.id && !players[i].dead) {
					newMax = players[i].score;
					crowned = i;
				}
				else if (i != this.id && players[i].score > newMax && !players[i].dead) {
					newMax = players[i].score;
					crowned = i;
				}
			}

			if (crowned != -1 && players[crowned].dead) {
				crowned = -1;
				highScore = 0;
			}
		}
	},

	collect: function(player, power) {
		var randSound = this.game.rnd.integerInRange(0, numberSounds);
		if (!mute) {
			collectSounds[randSound].play();
		}
		power.kill();
		this.killTrail = false;
		this.growth = 60*power.scale.x;
		this.score = this.score + power.scale.x;

		if (this.score > highScore && numberPlayers != 0) {
			highScore = this.score;
			if(crowned > -1){
				players[crowned].removeCrown();
			}
			crowned = this.id;
			lastCrowned = crowned+1;
			
		}

		if (numberPlayers == 0) {
			highScore++;
			var powerup = new PowerUp(this.game);
			powerup.create();

			ballsScore++;
			localStorage.setItem("ballsScore", ballsScore);

			if((nextBallHigh == 0) && (highScore==bestScore-1)){
				nextBallHigh = 1;
			}

			if (highScore > bestScore) {
				bestScore = highScore;
				localStorage.setItem("highScore", highScore);
			}
		}

	},

	addCrown: function() {
		this.sprite.loadTexture('crown' + this.id)
	},

	removeCrown: function() {
		this.sprite.loadTexture('player' + this.id)
	},

	pause: function() {
		if(this.textTween){
			this.textTween.pause();
		}
		this.sprite.body.angularVelocity = 0;
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
	},

	unpause: function() {
		if(this.textTween){
			this.textTween.resume();
		}
		this.sprite.body.angularVelocity = this.direction*200*this.angularVelocity*this.speed*scale;
	},

	render: function(){
		//this.game.debug.geom(this.circle,'#cfffff');
		//this.game.debug.body(this.sprite);

	}
};