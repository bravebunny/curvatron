var OldPlayer = function (x, y, mode, game) {
	this.game = game;
	this.mode = mode;
	this.sprite = game.add.sprite(x, y, 'player0');
	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

	this.direction = 1;
	this.distance = 0;
	this.maxDistance = 40;
	this.angle = 0;
	this.speed = 3;

	this.x = x;
	this.y = y;
	this.key = keys[0];
	this.killTrail = false;
	this.dead = false;
	this.ready = false;
	this.growth = 30;
	this.lastTrailLength = 0;
	this.keyText = null;
	this.paused = false;
	this.textTween = null;
	this.trailArray = [];
	this.trail = null
	this.showKeyTime = 0;
	this.showOneKey = true;
	this.touch = null;
	this.orientation = null;
	this.playerMobileButton = null;
	this.color = Phaser.Color.hexToColor("#FFFFFF");
};

OldPlayer.prototype = {
	create: function () {
		this.orientation = Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
		this.sprite.anchor.setTo(.5,.5);

		this.trail = this.game.make.sprite(0, 0, 'trail0');
		this.trail.anchor.set(0.5);
		this.trail.scale.set(scale);

		
		this.sprite.scale.set(scale);
		//this.sprite.body.setSize(20,20,0,0);
    this.lastTrailLength = this.growth;

		//this.sprite.body.angularVelocity = this.direction*200*this.angularVelocity*this.speed*scale;

		if (mobile) {
			this.game.input.onDown.add(this.click, this);
		} else if (mobile && !this.mode.sp){
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
		} else {
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

		if (this.showKeyTime <= totalTime && !this.dead && !paused) {
			this.showKey();
		}

		if (!this.paused) {

			this.sprite.angle = 90*this.angle;

			switch(this.angle) {
	    case 0:
	    	this.sprite.x += this.speed;
      break;
	    case 1:
	      this.sprite.y += this.speed;
      break;
     	case 2:
	      this.sprite.x -= this.speed;
    	break;
     	case 3:
	      this.sprite.y -= this.speed;
      break;
			}		

			if (this.distance >= this.maxDistance) {
				this.distance = 0;
				this.angle = this.angle + this.direction;
				if (this.angle > 3) {
					this.angle = 0;
				} else if (this.angle < 0) {
					this.angle = 3;
				}
			} else {
				this.distance++;
			}

			if (!this.sprite.alive) {
				this.kill();
			}

			var xx = Math.cos(this.sprite.rotation)*18*scale + this.sprite.x;
			var yy = Math.sin(this.sprite.rotation)*18*scale + this.sprite.y;

			if (!this.dead) {		
				//Create trail
				trailPiece = {"x": this.sprite.x,"y": this.sprite.y, "n": 1};
				this.trailArray.push(trailPiece);
				bmd.draw(this.trail, this.sprite.x, this.sprite.y);

				//collision detection
				var collSize = 12*scale;
				for (var j = 0; j < this.trailArray.length; j++) {
					var curTrail = this.trailArray[j];
					if (curTrail && curTrail.x-collSize < xx && curTrail.x+collSize > xx &&
						 	curTrail.y-collSize < yy && curTrail.y+collSize > yy) {
						 	this.kill();
					}
				}

			}
			this.game.physics.arcade.overlap(this.sprite, groupPowers, this.collect, null, this);

			var trailPiece = null;
			var ctx = bmd.context;

			//erase trail from front
			if (this.dead && this.trailArray[0]) {
				trailPiece = this.trailArray.pop();
		    	ctx.clearRect(trailPiece.x-9*scale, trailPiece.y-9*scale, 18*scale, 18*scale);
				
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
			if (this.killTrail && this.trailArray[0]) {
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
					ctx.clearRect(trailPiece.x-9*scale, trailPiece.y-9*scale, 18*scale, 18*scale);
				}

				if (this.trailArray.length > 0) {
					bmd.draw(this.trail, this.trailArray[0].x, this.trailArray[0].y);
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
		console.log("keypressed")
		this.ready = true;
		this.showOneKey = true;
		this.showKeyTime = 2 + totalTime;
		if (!this.dead) {
			if (this.direction == 1 && !gameOver) {
				this.direction = -1;
				this.distance = this.maxDistance;
			} else if (!gameOver && !paused) {
				this.direction = 1;
				this.distance = this.maxDistance;
			}
			if (this.keyText.alpha == 1) {
				this.textTween = this.game.add.tween(this.keyText).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
				
				if (mobile) {
					this.game.add.tween(this.touch).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
					this.game.add.tween(this.touch).to( { y: this.touch.y + 100 }, 1000, Phaser.Easing.Circular.In, true);
				}

				if (!mobile) {
					this.game.add.tween(tempLabel).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
					this.game.add.tween(tempLabelText).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
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
			var deathScore = parseInt(localStorage.getItem("deathScore"));
			if (isNaN(deathScore)) {
				deathScore = 0;
			}
			localStorage.setItem("deathScore", deathScore+1);

			this.sprite.kill();
			if (!mute) {
				killSound.play();
			}
			this.dead = true;
			
		}

		if (other) {
			other.kill();
		}
	},

	collect: function (player, power) {
		if (!mute) {
			collectSound.play();
		}
		if (power.name == "point") {
			this.killTrail = false;
			this.growth = 60*power.scale.x;
			this.score = this.score + power.scale.x;
		} else if (power.name == "shrink") {
			this.shrinkSize = this.trailArray.length - this.shrinkAmount;
			this.lastTrailLength -= this.shrinkAmount;
			this.shrink = true;
		}

		this.mode.collect(player, power, this);
		
		power.kill();
	},

	showKey: function () {
		//Show player's key
		if (this.showOneKey) {
			var keyX = this.sprite.x + 65;
			var keyY = this.sprite.y + 65;
			this.showOneKey = false;
			if (this.keyText) {
				this.textTween = this.game.add.tween(this.keyText).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
				this.keyText.x = keyX;
				this.keyText.y = keyY;
			} else {
				this.keyText = this.game.add.text(keyX, keyY, String.fromCharCode(this.key),{
			        font: "60px dosis",
			        fill: colorHexDark,
			        align: "center"});
				this.keyText.scale.set(scale);
	  		this.keyText.anchor.setTo(0.5,0.5);

		  	if (mobile) {
		  		this.keyText.setText(this.mode.getHighScore());
		  		if (!this.mode.sp) {
		  			this.keyText.visible = false;
		  		}
		  		
		  	}
			}

			if (mobile) {
				if (this.orientation == 'portrait') {
					this.touch = this.game.add.sprite(w2, h2*1.5+100, 'touch');
				} else {
					this.touch = this.game.add.sprite(w2*0.5, h2+100, 'touch');
				}
				this.touch.anchor.setTo(.5, .5);
				this.touch.alpha = 0;
				this.game.add.tween(this.touch).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
				this.game.add.tween(this.touch).to( { y: this.touch.y - 100 }, 1000, Phaser.Easing.Circular.Out, true);
			}
		}
	},

	pause: function () {
		if (this.mode.submitScore) {
			this.mode.submitScore();
		}
		if (this.textTween) {
			this.textTween.pause();
		}
	},

	unpause: function () {
		if (this.textTween) {
			this.textTween.resume();
		}
	}

};