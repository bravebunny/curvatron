var gameMananger = function (game) {
	this.crown = null;
	this.gameTime = 60; //sec 
	this.initialTime = 0;
	this.powerTimer = null;
	this.ui = {};
	this.mode = null;
	colisionMargin = 16;
}

gameMananger.prototype = {
	init: function (mode) {
		this.mode = mode;
	},

	create: function () {
		this.orientation = Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
		scale = 1;
		if (!this.mode.sp) {
			scale = (-1/24)*this.mode.nPlayers+7/12;
		}

		crowned = -1;
		lastCrowned = -1;
		players = [];
		gameOver = false;
		muteAudio = false;
		paused = false;
		totalTime = 0;
		pauseTween = null;
		borders = [0, this.game.world.width, 0,this.game.world.height];
		bmd = null;
		nextBallHigh = 0;

		changeColor = true;

		//create sound effects
		moveSounds = [];
		moveSounds[0] = this.add.audio('move0');
		moveSounds[1] = this.add.audio('move1');
		killSound = this.add.audio('kill');

		collectSound = this.add.audio('sfx_collect0');

		this.initialTime = this.game.time.totalElapsedSeconds();

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 0;

		var ui = this.ui;
		ui.graphics = this.add.graphics(w2, h2);


		groupPowers = this.add.group();
		if (this.mode.sp) {
			if (!mobile) {
				tempLabel = this.add.sprite(w2, h2, 'score');
				tempLabel.anchor.setTo(0.5,0.5);
				tempLabel.alpha = 0.7;
				tempLabelText = this.add.text(w2+50, h2+8, this.mode.getHighScore().toString(), {
		      font: "100px dosis",
		      fill: colorHex,
		      align: "center"
		  	});
		  	tempLabelText.anchor.setTo(0.5,0.5);
	  	}

		} else {
			this.crown = this.add.sprite(w2, -32, 'crown');
			this.crown.anchor.setTo(0.5,0.8);
			this.game.physics.enable(this.crown, Phaser.Physics.ARCADE);

			ui.graphics.lineStyle(0);
			ui.graphics.beginFill(0x000000, 0.2);
			ui.timeCircle = ui.graphics.drawCircle(w2,h2,Math.sqrt(w2*w2+h2*h2)*2);
			ui.timeCircle.pivot.x = w2;
			ui.timeCircle.pivot.y = h2;
			ui.graphics.endFill();

			//Generate powers
			this.powerTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.createPower, this);
 		}

		if (mobile) {
			pauseSprite = this.add.button(2*w2 - 100, 100, 'pauseButton', this.touchPauseButton, this);
    	pauseSprite.anchor.setTo(0.5, 0.5);
    	pauseSprite.input.useHandCursor = true;
    	pauseSprite.scale.set(0.5);
		}

		//create BitmapData
		bmd = this.add.bitmapData(this.game.width, this.game.height);
		bmd.addToWorld();
		bmd.smoothed = true;

		var angle = 0;
		if (mobile && this.orientation == "portrait") {
			angle = Math.PI/2;
		}

		//Choose snake locations
		var nPlayers = 0;
		if (this.mode.nPlayers) {
			nPlayers = this.mode.nPlayers;
		}
		for(var i=0; i <= nPlayers; i++){
			players[i] = new Player(i,
			Math.cos((2*Math.PI/(nPlayers+1))*i - angle)*(w2-200)+w2, 
			Math.sin((2*Math.PI/(nPlayers+1))*i - angle)*(h2-100)+h2, 
			keys[i], this.mode, this.game);
		}

		this.mode.create();

		if (this.mode.sp) {
			this.game.stage.backgroundColor = colorHex;
			document.body.style.background = colorHexDark;
			bgColor = Phaser.Color.hexToColor(colorHex);
		} else {
			this.game.stage.backgroundColor = colorHexDark;
			bgColor = Phaser.Color.hexToColor(colorHexDark);
		}

		if (this.mode.spawnPowers){
			this.createPower();
		}

		for(var i=0; i <= nPlayers; i++){
			players[i].create();
		}

		ui.overlay = this.add.button(0, 0, 'overlay', function(){
			if (gameOver) {
				this.state.restart(true, false, this.mode);
			}
		},this);
		ui.overlay.scale.set(0);
		ui.overlay.alpha = 0.5;

		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.pause, this);
		
		if (!mute) {
			menuMusic.volume = 1;
		}
	},

	update: function () {
		if(!paused){
			if (menuMusic.isPlaying && (menuMusic.volume == 1) && !gameOver && !mute) {
				menuMusic.fadeOut(2000);
			}
			totalTime += this.game.time.physicsElapsed;

		/*if(!this.mode.gridIsFull()){
			this.mode.createPower("point");
			this.mode.createObstacle();
		}*/

			if (!gameOver) {
				//Give crown
				if (crowned != -1) {
					players[crowned].addCrown();
				}
				if(!this.mode.sp && this.gameTime >= (totalTime)){
					this.ui.timeCircle.scale.set((-1/this.gameTime)*(totalTime)+1);
				}
				else if(!this.mode.sp){
					this.endGame();
				}	else if(players[0].dead){
					this.endGame();
				}

				var numberAlive = 0;
				var playerAlive = -1;
				for (var i = 0; i < players.length; i++) {
					if (!players[i].dead) {
						playerAlive = i;
						numberAlive++;
						if (numberAlive > 1) break;
					}
				}
				if(numberAlive < 2 && !this.mode.sp) {
					lastCrowned = playerAlive;
					this.endGame();
				}

				if (this.mode.update) {
					this.mode.update();
				}

			}
		}
		//Update players
		for(var i=0; i < players.length; i++){
			players[i].update();
		}
	},

	createPower: function () {
		if (this.mode.createPower) {
			this.mode.createPower('point');
		} else {
			var powerup = new PowerUp(this.game, 'point', this.mode);
			powerup.create();
		}
	},

	endGame: function (){
		var ui = this.ui;
		if (!gameOver) {
			if (this.mode.endGame) {
				this.mode.endGame();
			}

			if (!mute) {
				menuMusic.play();
				menuMusic.volume = 1;
			}
			ui.overlay.inputEnabled = false;
			if(this.mode.sp){
				this.game.time.events.add(Phaser.Timer.SECOND * 1, function() {
					ui.overlay.inputEnabled = true;
				}, this);
			}

			ui.overlay.width = w2*2;
			ui.overlay.height = h2*2;
			if (!this.mode.sp) {
				this.game.time.events.remove(this.powerTimer);
				this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(
					function(){
						this.state.restart(true, false, this.mode);
					}, this);
			}

	  	var restartButton = this.add.button(w2+97, h2-97,"restart_button");

			restartButton.scale.set(1,1);
			restartButton.anchor.setTo(0.5,0.5);
			restartButton.input.useHandCursor=true;
			clickButton(restartButton, 
				function () {
	  			this.state.restart(true, false, this.mode);
	  		}, this);

			var mainMenu = this.add.button(w2-97, h2-97,"exit_button");
			mainMenu.scale.set(1,1);
			mainMenu.anchor.setTo(0.5,0.5);
			mainMenu.input.useHandCursor=true;
			clickButton(mainMenu,function(){this.state.start("Menu");}, this);

			if (mobile) {
				pauseSprite.alpha = 0;
				pauseSprite.input.useHandCursor=false;
			}

	  	if (!this.mode.sp) {
	  		//console.log("right now:" + crowned);
	  		if (crowned == -1) {
	  			var tie =  this.add.sprite(w2,h2+150, "tie");
	  			tie.anchor.setTo(0.5,0.5);

					/*var scoreInMenu = this.add.text(w2, h2+128, "It's a tie", {
			        font: "80px dosis",
			        fill: "#ffffff",
			        align: "center"
			    });
					scoreInMenu.anchor.setTo(0.5,0.5);*/
	  		} else {
		  		var winnerFill = this.add.sprite(w2-75,h2+97, "player" + players[crowned].id);
		  		winnerFill.scale.set(5);
		  		winnerFill.anchor.setTo(0.5,0.5);

				var winnerLabel = this.add.sprite(w2, h2+97,"winner");
				winnerLabel.scale.set(1,1);
				winnerLabel.anchor.setTo(0.5,0.5);
				var textWinner = this.add.text(w2+50, h2+105, String.fromCharCode(players[crowned].key), {
			      font: "100px dosis",
			      fill: colorPlayers[crowned],
			      align: "center"
		    	});
		    	textWinner.anchor.setTo(0.5,0.5);
	  		}
	  		
	  	} else {
				var spAuxLabel = this.add.sprite(w2, h2+77,"aux-stat");
				spAuxLabel.scale.set(0.9,0.9);
				spAuxLabel.anchor.setTo(0.5,0.5);
				spAuxLabel.alpha = 0.7;

				var spScoreLabel = this.add.sprite(w2,h2+217,"score-stat");
				spScoreLabel.scale.set(0.6,0.6);
				spScoreLabel.anchor.setTo(0.5,0.5);
				spScoreLabel.alpha = 0.7;
	    	if (mobile) {
    			spScoreLabel.x = w2 - 60;
	  		}

				var textCurrentScore = this.add.text(w2, h2+77, this.mode.getScore().toString(),{
					font: "90px dosis",
	      	fill: colorHexDark,
	      	align: "center"
				});

				if (this.mode.submitScore) {
					this.mode.submitScore();
				}

				var textHighScore = this.add.text(w2+35, h2+220, this.mode.getHighScore().toString(), {
		      font: "40px dosis",
		      fill: colorHexDark,
		      align: "center"
	    	});

	    	if (mobile) {
	  			textHighScore.x = w2+35 - 60;
	  		}
	    	textCurrentScore.anchor.setTo(0.5,0.5);
	    	textHighScore.anchor.setTo(0.5,0.5);



	    	if (mobile) {
	    		leaderboardButton = this.add.button(w2+105, h2+217,"leaderboard_button");
					leaderboardButton.scale.set(0.6,0.6);
					leaderboardButton.anchor.setTo(0.5,0.5);
					leaderboardButton.input.useHandCursor=true;
					clickButton(leaderboardButton, this.leaderboard, this);
	    	}
    	}
	  	gameOver = true;
		}
	},

	pause: function() {
		var ui = this.ui;
		if (!paused) { //pause
			this.game.tweens.pauseAll();
			if (this.mode.pause) {
				this.mode.pause();
			}

			if (gameOver) {
				this.state.start("Menu");
			}
			ui.overlay.width = w2*2;
			ui.overlay.height = h2*2;

			if (pauseTween) {
				pauseTween.stop();
			}
			paused = true;
			ui.overlay.inputEnabled = false;

			if (mobile) {
				pauseSprite.alpha = 0;
			} else if (this.mode.sp) {
				tempLabel.alpha = 0;
				tempLabelText.alpha = 0;
			}

			if (!this.mode.sp) {
				this.game.time.events.remove(this.powerTimer);
			}

        ui.menu = this.add.button(w2, h2-150, 'resume_button');
        ui.menu.anchor.setTo(0.5, 0.5);
        ui.menu.scale.set(1,1);
        ui.menu.input.useHandCursor=true;
        clickButton(ui.menu,this.pause, this);

        ui.restart = this.add.button(w2-150, h2, 'restart_button');
        ui.restart.anchor.setTo(0.5, 0.5);
        ui.restart.scale.set(1,1);
        ui.restart.input.useHandCursor=true;
        clickButton(ui.restart,function(){this.state.restart(true, false, this.mode);}, this);

        ui.exit = this.add.button(w2, h2+150, 'exit_button');
        ui.exit.anchor.setTo(0.5, 0.5);
        ui.exit.scale.set(1,1);
        ui.exit.input.useHandCursor=true;
        clickButton(ui.exit,function(){this.state.start("Menu");}, this);

        if (mute) {
	    	ui.audioButton = this.add.button(w2+150, h2,"audiooff_button");
	  		ui.audioButton.anchor.setTo(0.5,0.5);
	  		ui.audioButton.scale.set(1,1);
	  		ui.audioButton.input.useHandCursor=true;
		    } else {
	        ui.audioButton = this.add.button(w2+150, h2,"audio_button");
	        ui.audioButton.anchor.setTo(0.5,0.5);
	        ui.audioButton.scale.set(1,1);
	        ui.audioButton.input.useHandCursor=true;
		    }
	    	clickButton(ui.audioButton,this.muteSound, this);
			
		} else { //unpause
			this.game.tweens.resumeAll();
			ui.overlay.scale.set(0);

			if (this.mode.unPause) {
				this.mode.unPause();
			}

			if (!this.mode.sp) {
				this.powerTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.createPower, this);
			}

			ui.overlay.inputEnabled = true;

			if (mobile) {
				pauseSprite.alpha = 0.2;
				pauseSprite.input.useHandCursor=true;
			}
			ui.menu.destroy();
            ui.restart.destroy();
            ui.exit.destroy();
            ui.audioButton.destroy();
            paused = false;
		}

	},

	touchPauseButton: function(){
		if (!paused) {
			this.pause();
			if (mobile) {
				pauseSprite.input.useHandCursor=false;
			}
		}	
	},

	leaderboard: function () {
    if (mobile) {
      var params = Cocoon.Social.ScoreParams;
      params.leaderboardID = this.mode.leaderboardID;
      if (!socialService) {
        var gp = Cocoon.Social.GooglePlayGames;
        gp.init({});
        socialService = gp.getSocialInterface();

        if (!socialService.isLoggedIn()) {
        socialService.login(function(loggedIn, error) {
          if (error) {
            } else if (loggedIn) {
            	var score = this.mode.getScore();
            	socialService.submitScore(score, function() {
            		socialService.showLeaderboard(null, params);
            	}, params);
            }
          }.bind(this));
        }
      } else if (socialService.isLoggedIn()){
        socialService.showLeaderboard(null, params);
      }     
    }
	},

	muteSound: function (){
	    if (mute) {
		    this.ui.audioButton.loadTexture('audio_button');
		    mute = false;
	    } else {
	      this.ui.audioButton.loadTexture('audiooff_button');
	      mute = true;
	      if (menuMusic && menuMusic.isPlaying) {
	      	menuMusic.stop();
	    	}
	    }
	},

	backPressed: function () {
    	this.pause();
  	},

	/*render: function(){
		players[0].render();
	},*/

	renderGroup: function (member) {
		//this.game.debug.body(member);
	}
};