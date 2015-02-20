var gameMananger = function (game) {
	this.crown = null;
	this.gameTime = 60; //sec 
	this.initialTime = 0;
	this.powerTimer = null;
	this.ui = {};
	scale = 1;
}

gameMananger.prototype = {
	create: function () {
		if (numberPlayers > 0) {
			scale = (-1/24)*numberPlayers+7/12;
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

		highScore = 0;
		survivalScore = 0;

		changeColor = true;

		//create sound effects
		moveSounds = [];
		moveSounds[0] = this.add.audio('move0');
		moveSounds[1] = this.add.audio('move1');
		killSound = this.add.audio('kill');

		collectSounds = []
		for (var i = 0; i <= numberSounds; i++) {
		  	collectSounds[i] = this.add.audio('sfx_collect' + i);
		}
		nextBallHigh = 0;

		if (numberPlayers > 0) {
			this.game.stage.backgroundColor = colorHexDark;
			bgColor = Phaser.Color.hexToColor(colorHexDark);
		} else {
			document.body.style.background = colorHexDark;
			bgColor = Phaser.Color.hexToColor(colorHex);
		}

		if (numberPlayers > 0) {
			this.crown = this.add.sprite(w2, -32, 'crown');
			this.crown.anchor.setTo(0.5,0.8);
			this.game.physics.enable(this.crown, Phaser.Physics.ARCADE);
		}

		this.initialTime = this.game.time.totalElapsedSeconds();

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 0;

		var ui = this.ui;

		ui.graphics = this.add.graphics(w2, h2);
		if(numberPlayers > 0){
			ui.graphics.lineStyle(0);
			ui.graphics.beginFill(0x000000, 0.2);
			ui.timeCircle = ui.graphics.drawCircle(w2,h2,Math.sqrt(w2*w2+h2*h2)*2);
			ui.timeCircle.pivot.x = w2;
			ui.timeCircle.pivot.y = h2;
			ui.graphics.endFill();
		}

		groupPowers = this.add.group();
		if (numberPlayers == 0) {
			var textSize = 15;
		  	if (mobile) {
		  		textSize = 30
		  	}

			powerText = this.add.text(this.x, this.y, "1", {
				font: "" + textSize + "px dosis",
		      	fill: "#ffffff",
		      	align: "center"
		  	});
		  	powerText.anchor.setTo(0.5,0.5);			
		}

		//Generate powers
		if (numberPlayers > 0) {
			this.powerTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.createPower, this);
		} else if(mod == 0){
			this.createPower();
		}

		if(mobile){
			ui.pauseSprite = this.add.button(w2, h2, 'pauseButton',this.touchPauseButton,this);
	    	ui.pauseSprite.anchor.setTo(0.5, 0.5);
	    	ui.pauseSprite.input.useHandCursor = true;
		} else if (numberPlayers == 0){
			tempLabel = this.add.sprite(w2, h2, 'score-stat');
			tempLabel.anchor.setTo(0.5,0.5);
			tempLabel.alpha = 0.7;
			if(mod==0){
				tempLabelText = this.add.text(w2+50, h2+8, bestScore.toString(), {
			      font: "100px dosis",
			      fill: colorHex,
			      align: "center"
			  	});
			}
			else if(mod==1){
				tempLabelText = this.add.text(w2+50, h2+8, bestSurvScore.toString(), {
			      font: "80px dosis",
			      fill: colorHex,
			      align: "center"
			  	});
			}
	  	tempLabelText.anchor.setTo(0.5,0.5);
		}

		//create BitmapData
		bmd = this.add.bitmapData(this.game.width, this.game.height);
		bmd.addToWorld();
		bmd.smoothed = true;

		//Choose snake locations
		for(var i=0; i <= numberPlayers; i++){
			players[i] = new Player(i,
			Math.cos((2*Math.PI/(numberPlayers+1))*i)*(w2-200)+w2, 
			Math.sin((2*Math.PI/(numberPlayers+1))*i)*(h2-100)+h2, 
			keys[i], this.game);
		}

		for(var i=0; i <= numberPlayers; i++){
			players[i].create();
		}

		ui.overlay = this.add.sprite(0, 0, 'overlay');
		ui.overlay.width = w2*2;
		ui.overlay.height = h2*2;
		ui.overlay.alpha = 0;

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

			
			if (!gameOver) {
				//Give crown
				if (crowned != -1) {
					players[crowned].addCrown();
				}
				if(numberPlayers>0 && this.gameTime >= (totalTime)){
					this.ui.timeCircle.scale.set((-1/this.gameTime)*(totalTime)+1);
				}
				else if(numberPlayers>0){
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
				if(numberAlive < 2 && numberPlayers>0) {
					lastCrowned = playerAlive;
					this.endGame();
				}

			}
		}
		//Update players
		for(var i=0; i <= numberPlayers; i++){
			players[i].update();
		}
	},

	createPower: function () {
		var powerup = new PowerUp(this.game, "point");
		powerup.create();
	},

	endGame: function (){
		var ui = this.ui;
		if (!gameOver) {
			if (!mute) {
				menuMusic.play();
				menuMusic.volume = 1;
			}
			this.game.input.onDown.active = false;
			this.game.time.events.add(Phaser.Timer.SECOND * 1, function() {
				this.game.input.onDown.active = true;
			}, this);

			ui.overlay.alpha = 0.5;
			if (numberPlayers > 0) {
				this.game.time.events.remove(this.powerTimer);
				this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(
					function(){
						this.state.restart(true,false,numberPlayers);
					}, this);
			}

	  		var restartButton = this.add.button(w2+97, h2-97,"restart_button",function(){this.state.restart(true,false,numberPlayers);},this);
			restartButton.scale.set(1,1);
			restartButton.anchor.setTo(0.5,0.5);
			restartButton.input.useHandCursor=true;

			var mainMenu = this.add.button(w2-97, h2-97,"exit_button",function(){this.state.start("Menu");},this);
			mainMenu.scale.set(1,1);
			mainMenu.anchor.setTo(0.5,0.5);
			mainMenu.input.useHandCursor=true;

			if (mobile) {
				ui.pauseSprite.alpha = 0;
				ui.pauseSprite.input.useHandCursor=false;
			}

		  	if (numberPlayers > 0) {
		  		//console.log("right now:" + crowned);
		  		if (crowned == -1) {
					var scoreInMenu = this.add.text(w2, h2+128, "It's a tie", {
				        font: "80px dosis",
				        fill: "#ffffff",
				        align: "center"
				    });
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

				if(mod == 0){
					var textCurretnScore = this.add.text(w2, h2+77, highScore,{
						font: "90px dosis",
				      	fill: colorHexDark,
				      	align: "center"
					});
					var statsPlayers = this.add.text(w2+35, h2+220, bestScore, {
				      font: "40px dosis",
				      fill: colorHexDark,
				      align: "center"
			    	});
		    	}
		    	else if(mod == 1){
		    		var textCurretnScore = this.add.text(w2, h2+77, survivalScore,{
						font: "90px dosis",
				      	fill: colorHexDark,
				      	align: "center"
					});
		    		var statsPlayers = this.add.text(w2+35, h2+220, bestSurvScore, {
				      font: "40px dosis",
				      fill: colorHexDark,
				      align: "center"
			    	});
		    	}
		    	textCurretnScore.anchor.setTo(0.5,0.5);
		    	statsPlayers.anchor.setTo(0.5,0.5);
	    	}
		  	gameOver = true;
		}
	},

	pause: function() {
		var ui = this.ui;
		if (!paused) { //pause
			if (gameOver) {
				this.state.start("Menu");
			}
			ui.overlay.alpha = 0.5;

			if (pauseTween) {
				pauseTween.stop();
			}
			paused = true;
			this.game.input.onDown.active = false;

			if (mobile) {
				ui.pauseSprite.alpha = 0;
			} else if (numberPlayers == 0) {
				tempLabel.alpha = 0;
				tempLabelText.alpha = 0;
			}

			if (numberPlayers > 0) {
				this.game.time.events.remove(this.powerTimer);
			}

	        ui.menu = this.add.button(w2, h2-150, 'resume_button',function(){this.pause();},this);
	        ui.menu.anchor.setTo(0.5, 0.5);
	        ui.menu.scale.set(1,1);
	        ui.menu.input.useHandCursor=true;

	        ui.restart = this.add.button(w2-150, h2, 'restart_button',function(){this.state.restart();},this);
	        ui.restart.anchor.setTo(0.5, 0.5);
	        ui.restart.scale.set(1,1);
	        ui.restart.input.useHandCursor=true;

	        ui.exit = this.add.button(w2, h2+150, 'exit_button',function(){this.state.start("Menu");},this);
	        ui.exit.anchor.setTo(0.5, 0.5);
	        ui.exit.scale.set(1,1);
	        ui.exit.input.useHandCursor=true;

	        if (mute) {
		    	ui.audioButton = this.add.button(w2+150, h2,"audiooff_button",this.muteSound,this);
		  		ui.audioButton.anchor.setTo(0.5,0.5);
		  		ui.audioButton.scale.set(1,1);
		  		ui.audioButton.input.useHandCursor=true;
		    } else {
		        ui.audioButton = this.add.button(w2+150, h2,"audio_button",this.muteSound,this);
		        ui.audioButton.anchor.setTo(0.5,0.5);
		        ui.audioButton.scale.set(1,1);
		        ui.audioButton.input.useHandCursor=true;
		    }
			
		} else { //unpause
			ui.overlay.alpha = 0;
			if (numberPlayers > 0) {
				this.powerTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.createPower, this);
			}

			this.game.input.onDown.active = true;

			if (mobile) {
				ui.pauseSprite.alpha = 0.1;
				ui.pauseSprite.input.useHandCursor=true;
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
				this.ui.pauseSprite.input.useHandCursor=false;
			}
		}	
	},

	muteSound: function(){
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

	backPressed: function() {
    	this.pause();
  	},

	/*render: function(){
		players[0].render();
	},*/

	renderGroup: function(member) {
		//this.game.debug.body(member);
	}
};