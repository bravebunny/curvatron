var Player = function (id, x, y, key, game) {
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
	this.ready = false;
	this.speed = 1;
	this.angularVelocity = 1;
	this.growth = 30;
	this.frameCount = 0;
	this.lastTrailLength = 0;
	this.keyText = null;
	this.paused = false;
	this.textTween = null;
	this.trailArray = [];
	this.trail = null
	this.showKeyTime = 0;
	this.showOneKey = true;
	this.shrink = false;
	this.shrinkAmount = 200;
	this.touch = null;
	this.orientation = null;
	this.playerMobileButton = null;
};

Player.prototype = {
	create: function () {
		this.orientation = Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
		if (numberPlayers == 0 && this.orientation == "portrait" && mobile) {
			this.sprite = this.game.add.sprite(w2, h2*0.18, 'player' + this.id);
		} else {
			this.sprite = this.game.add.sprite(this.x, this.y, 'player' + this.id);
		}

		this.sprite.anchor.setTo(.5,.5);
		this.trail = this.game.make.sprite(0, 0, 'trail' + this.id);
		this.trail.anchor.set(0.5);
		this.trail.scale.set(scale);

		//used to do this in a fancier way, but it broke some stuff
		if (this.y > h2) {
			this.sprite.rotation = Math.PI;
		}

		if (numberPlayers > 0) {
			this.color = Phaser.Color.hexToColor(colorPlayers[this.id]);
		} else {
			this.color = Phaser.Color.hexToColor("#FFFFFF");
		}
		
		this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
		this.sprite.scale.set(scale);
		//this.sprite.body.setSize(20,20,0,0);
    this.lastTrailLength = this.growth;

		this.sprite.body.angularVelocity = this.direction*200*this.angularVelocity*this.speed*scale;

		if (mobile && numberPlayers == 0) {
			this.game.input.onDown.add(this.click, this);
		} else if (mobile && numberPlayers > 0){
			if (this.orientation == "portrait") {
				this.playerMobileButton = this.game.add.button(w2,this.y,"overlay",null,this);
				this.playerMobileButton.width = this.game.width;
				this.playerMobileButton.height = this.game.height/2;
				this.playerMobileButton.onInputDown.add(this.click, this);
			} else {
				this.playerMobileButton = this.game.add.button(this.x,h2,"overlay",null,this);	
				this.playerMobileButton.width = this.game.width/2;
				this.playerMobileButton.height = this.game.height;
				this.playerMobileButton.onInputDown.add(this.click, this);	
	    	}
	    		this.playerMobileButton.alpha = 0;
	    		this.playerMobileButton.anchor.setTo(0.5,0.5);
	    		this.playerMobileButton.input.useHandCursor = true;
		} else if (!mobile && numberPlayers == 0) {
			this.game.input.onDown.add(this.keyPressed, this);
		}

		this.showKey();

		this.input = this.game.input.keyboard.addKey(this.key).onDown.add(this.keyPressed, this);
	},

	update: function () {
		if (!this.paused && paused) {
			this.paused = true;
			this.pause();
		} else if (this.paused && !paused) {
			this.paused = false;
			this.unpause();
		}

		if (this.showKeyTime <= totalTime && !this.dead) {
			this.showKey();
		}

		if (!this.paused) {

			if (!this.sprite.alive) {
				this.kill();
			}

			this.game.physics.arcade.velocityFromAngle(this.sprite.angle, 300*this.speed*scale, this.sprite.body.velocity);
			this.sprite.body.angularVelocity = this.direction*200*this.angularVelocity*this.speed;
			this.frameCount = (this.frameCount + 1) % 1/(this.speed*scale);

			var xx = Math.cos(this.sprite.rotation)*18*scale + this.sprite.x;
			var yy = Math.sin(this.sprite.rotation)*18*scale + this.sprite.y;

			if (!this.dead) {		
				//Create trail
				if (this.frameCount == 0 && !this.dead) {
					trailPiece = {"x": this.sprite.x,"y": this.sprite.y, "n": 1};
					this.trailArray.push(trailPiece);
					bmd.draw(this.trail, this.sprite.x, this.sprite.y);
				}

				//collision detection
				var collSize = 12*scale;

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

			//erase trail from front
			if (this.dead && this.frameCount == 0 && this.trailArray[0]) {
				trailPiece = this.trailArray.pop();
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
			if (this.killTrail && this.frameCount == 0 && this.trailArray[0]) {
				if (mod == 0 || (mod == 1 && !this.ready) || this.dead) {
					var nRemove = 1;
					if (this.shrink) {
						if (this.trailArray.length <= this.shrinkSize) {
							this.shrink = false;
						} else {
							nRemove = 4;
						}
					}
					for (var i = 0; i < nRemove && this.trailArray.length > 0; i++) {
						trailPiece = this.trailArray.shift();
						ctx.clearRect(trailPiece.x-10*scale, trailPiece.y-10*scale, 20*scale, 20*scale);
					}

					if (this.trailArray.length > 0) {
						bmd.draw(this.trail, this.trailArray[0].x, this.trailArray[0].y);
					}
				}
			}

			//Border's collisions
			if ((xx+colisionMargin*scale) <= borders[0]) {
				this.sprite.x = borders[1]-Math.cos(this.sprite.rotation)*30*scale;
			} else if ((xx-colisionMargin*scale)>=borders[1]) {
				this.sprite.x = borders[0]-Math.cos(this.sprite.rotation)*30*scale;
			}

			if ((yy+colisionMargin*scale)<=borders[2]) {
				this.sprite.y = borders[3]-Math.sin(this.sprite.rotation)*30*scale;
			} else if ((yy-colisionMargin*scale)>=borders[3]) {
				this.sprite.y = borders[2]-Math.sin(this.sprite.rotation)*30*scale;
			}
		}


	},


	keyPressed: function () {
		this.ready = true;
		this.showOneKey = true;
		this.showKeyTime = 2 + totalTime;
		if (!this.dead) {
			if (this.direction == 1 && !gameOver) {
				this.direction = -1;
				if (!mute && !paused) {
					moveSounds[0].play();
				}
			} else if (!gameOver && !paused) {
				this.direction = 1;
				if (!mute) {
					moveSounds[1].play();
				}
			}
			if (this.keyText.alpha == 1) {
				this.textTween = this.game.add.tween(this.keyText).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
				
				if (mobile && numberPlayers == 0) {
					this.game.add.tween(this.touch).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
					this.game.add.tween(this.touch).to( { y: this.touch.y + 100 }, 1000, Phaser.Easing.Circular.In, true);
				} else if(mobile && numberPlayers > 0){
					if (this.orientation == 'portrait'){
						this.game.add.tween(this.touch).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
						if (this.touch.angle == 0) {
							this.game.add.tween(this.touch).to( { y: this.touch.y + 90 }, 1000, Phaser.Easing.Circular.In, true);
						} else {
							this.game.add.tween(this.touch).to( { y: this.touch.y - 90 }, 1000, Phaser.Easing.Circular.In, true);
						}
					}
					else{
						this.game.add.tween(this.touch).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
						this.game.add.tween(this.touch).to( { x: this.touch.x - this.touch.angle }, 1000, Phaser.Easing.Circular.In, true);
					}
				}

				if (numberPlayers == 0 && !mobile) {
					tempLabel = this.game.add.tween(tempLabel).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
					tempLabelText = this.game.add.tween(tempLabelText).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
				}

				if (mobile && pauseSprite.alpha == 1) {
					pauseTween = this.game.add.tween(pauseSprite).to( { alpha: 0.1 }, 2000, Phaser.Easing.Linear.None, true);
				}
			}
		}
	},

	click: function () {
		var x1 = w2 - 81 , x2 = w2 + 81,
            y1 = h2 - 81, y2 = h2 + 81;

        if (!(this.game.input.position.x > x1 
        	&& this.game.input.position.x < x2 
        	&& this.game.input.position.y > y1 
        	&& this.game.input.position.y < y2 )) {
        		this.keyPressed();
        }
	},

	kill: function (player, other) {
		this.keyText.destroy();
		if (!this.dead) {
			if (numberPlayers == 0) {
				deathScore++;
				localStorage.setItem("deathScore", deathScore);
			}
			this.sprite.kill();
			if (!mute) {
				killSound.play();
			}
			this.dead = true;

			var alreadyDead = 0;
			for (var i = 0; i < players.length; i++) {
				if (players[i].dead) {
					alreadyDead++;
				}
			}

			var newMax = 0;
			for (var i = 0; i < players.length; i++) {
				if (players.length - alreadyDead == 1 && i != this.id && !players[i].dead) {
					newMax = players[i].score;
					crowned = i;
				} else if (i != this.id && players[i].score > newMax && !players[i].dead) {
					newMax = players[i].score;
					crowned = i;
				}
			}

			if (crowned != -1 && players[crowned].dead) {
				crowned = -1;
				highScore = 0;
			}

			this.submitScore();
		}

		if (other) {
			other.kill();
		}
	},

	submitScore: function () {
		var params = Cocoon.Social.ScoreParams;
		if (mod == 1) {
			survivalScore = this.trailArray.length;
			if (survivalScore > bestSurvScore) {
				bestSurvScore = survivalScore;
				localStorage.setItem("survivalScore", survivalScore);
			}
			params.leaderboardID = modesLB[1];
			if (mobile && socialService && socialService.isLoggedIn()) {
				socialService.submitScore(survivalScore, null, params);
			}

		} else if (mod == 0) {
			if (highScore > bestScore) {
				bestScore = highScore;
				localStorage.setItem("highScore", highScore);
			}
			params.leaderboardID = modesLB[0];
			if (mobile && socialService && socialService.isLoggedIn()) {
				socialService.submitScore(highScore, null, params);
			}
		}
	},

	collect: function (player, power) {
		var randSound = this.game.rnd.integerInRange(0, numberSounds);
		if (!mute) {
			collectSounds[randSound].play();
		}
		if (power.name == "point") {
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
				var powerup = new PowerUp(this.game, 'point');
				powerup.create();

				if (mod == 0 && ((highScore % 10) == 9) && (highScore > 0)) {
					var powerup = new PowerUp(this.game, "shrink");
					powerup.create();
				}

				ballsScore++;
				localStorage.setItem("ballsScore", ballsScore);

				if ((nextBallHigh == 0) && (highScore == bestScore-1)) {
					nextBallHigh = 1;
				}
			}
		} else if (power.name == "shrink") {
			this.shrinkSize = this.trailArray.length - this.shrinkAmount;
			this.lastTrailLength -= this.shrinkAmount;
			this.shrink = true;
		}
		power.kill();
	},

	showKey: function () {
		//Show player's key
		if (this.showOneKey) {
			var keyX = Math.round(Math.cos(this.sprite.rotation + Math.PI/2*this.direction)*88*scale) + this.sprite.x;
			var keyY = Math.round(Math.sin(this.sprite.rotation + Math.PI/2*this.direction)*88*scale) + this.sprite.y;
			this.showOneKey = false;
			if (this.keyText) {
				this.textTween = this.game.add.tween(this.keyText).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
				this.keyText.x = keyX;
				this.keyText.y = keyY;
			} else {
				this.keyText = this.game.add.text(keyX, keyY, String.fromCharCode(this.key),{
			        font: "60px dosis",
			        fill: "#ffffff",
			        align: "center"});
				this.keyText.scale.set(scale);
		  		this.keyText.anchor.setTo(0.5,0.5);

			  	if (mobile) {
			  		if (mod == 0) {
			  			this.keyText.setText(bestScore);
			  		} else {
			  			this.keyText.setText(bestSurvScore);
			  		}

			  		if (numberPlayers > 0) {
			  			this.keyText.visible = false;
			  		}
			  		
			  	}
			}

			if (numberPlayers == 0 && mobile) {
				if (this.orientation == 'portrait') {
					this.touch = this.game.add.sprite(w2, h2*1.5+100, 'touch');
				} else {
					this.touch = this.game.add.sprite(w2*0.5, h2+100, 'touch');
				}
				this.touch.anchor.setTo(.5, .5);
				this.touch.alpha = 0;
				this.game.add.tween(this.touch).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
				this.game.add.tween(this.touch).to( { y: this.touch.y - 100 }, 1000, Phaser.Easing.Circular.Out, true);
			} else if (numberPlayers > 0 && mobile) {
				if (this.orientation == 'portrait') {
					this.touch = this.game.add.sprite(w2, this.y, 'touch');
					if(this.y > w2){
						this.touch.angle = 0;
					} else{
						this.touch.angle = 180;
					}
					this.touch.anchor.setTo(.5, .5);
					this.touch.alpha = 0;
					this.game.add.tween(this.touch).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
					if (this.touch.angle == 0) {
						this.game.add.tween(this.touch).to( { y: this.touch.y - 100}, 1000, Phaser.Easing.Circular.Out, true);
					} else {
						this.game.add.tween(this.touch).to( { y: this.touch.y + 100}, 1000, Phaser.Easing.Circular.Out, true);
					}
				} else {
					this.touch = this.game.add.sprite(this.x, h2, 'touch');
					if(this.x > w2){
						this.touch.angle = -90;
					} else{
						this.touch.angle = 90;
					}
					this.touch.anchor.setTo(.5, .5);
					this.touch.alpha = 0;
					this.game.add.tween(this.touch).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
					this.game.add.tween(this.touch).to( { x: this.touch.x + this.touch.angle  }, 1000, Phaser.Easing.Circular.Out, true);
				}
			}
		}
	},

	addCrown: function () {
		this.sprite.loadTexture('crown' + this.id)
	},

	removeCrown: function () {
		this.sprite.loadTexture('player' + this.id)
	},

	pause: function () {
		this.submitScore();
		if (this.textTween) {
			this.textTween.pause();
		}
		this.sprite.body.angularVelocity = 0;
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
	},

	unpause: function () {
		if (this.textTween) {
			this.textTween.resume();
		}
		this.sprite.body.angularVelocity = this.direction*200*this.angularVelocity*this.speed*scale;
	},

	/*render: function(){
		game.debug.body(this.sprite);
	}*/

};