var gameMananger = function(game) {}

gameMananger.prototype = {
	init: function(){
		this.crown = null;
		highScore = 0;
		crowned = -1;
		players = [];
		this.timeCircle = null;
		this.gameTime = 60; //sec 
		this.initialTime = 0;
		lastCrowned = -1;
		scale = 1;
		if (numberPlayers > 0) {
			scale = (-1/24)*numberPlayers+7/12;
		}
		w2 = this.game.world.width/2;
		h2 = this.game.world.height/2;
		gameOver = false;
		graphics = this.game.add.graphics(w2, h2);
		muteAudio = false;
		paused = false;
		this.powerTimer = null;
		totalTime = 0;
		pauseTween = null;
		borders = [0, this.game.world.width, 0,this.game.world.height];
		bmd = null;
	},

	create: function() {
		changeColor = true;

    //create sound effects
    moveSounds = [];
    moveSounds[0] = this.game.add.audio('move0');
    moveSounds[1] = this.game.add.audio('move1');
    killSound = this.game.add.audio('kill');

		bmd = this.game.add.bitmapData(this.game.width, this.game.height);
		bmd.addToWorld();
		bmd.smoothed = false;
    
    collectSounds = []
    for (var i = 0; i <= numberSounds; i++) {
	  	collectSounds[i] = this.game.add.audio('sfx_collect' + i);
    }
		nextBallHigh = 0;

		if (numberPlayers > 0) {
			this.game.stage.backgroundColor = bgColorsDark[chosenColor];
		} else {
			document.body.style.background = bgColorsDark[chosenColor];
		}

		if(mobile){
			pauseSprite = this.game.add.button(w2, h2, 'pauseButton',this.touchePauseButton,this);
    	pauseSprite.anchor.setTo(0.5, 0.5);
    	pauseSprite.input.useHandCursor=true;
		} else if (numberPlayers == 0){
			tempLabel = this.game.add.sprite(w2, h2, 'score-stat');
			tempLabel.anchor.setTo(0.5,0.5);
			tempLabel.alpha = 0.7;
			tempLabelText = this.game.add.text(w2+50, h2+8, bestScore.toString(), {
	      font: "100px Dosis Extrabold",
	      fill: colorHex,
	      align: "center"
	  	});
	  	tempLabelText.anchor.setTo(0.5,0.5);
		}

		//Choose snake locations
		for(var i=0; i <= numberPlayers; i++){
			players[i] = new Player(i,
			Math.round(Math.cos((2*Math.PI/(numberPlayers+1))*i)*500)+w2, 
			Math.round(Math.sin((2*Math.PI/(numberPlayers+1))*i)*250)+h2, 
			keys[i], this.game);
		}

		groupPowers = this.game.add.group();
		groupTrails = [];

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 0;

		for(var i=0; i <= numberPlayers; i++){
			players[i].create();
			players[i].sprite.rotation = ((2*Math.PI/(numberPlayers+1))*i);
		}

		for(var i=0; i <= numberPlayers; i++){
			for (var j = 0; j < groupTrails.length; j++) {
				if (groupTrails[j] != players[i].groupTrail) {
					players[i].enemyTrails.push(groupTrails[j]);
				}
			}
		}

		if(numberPlayers > 0){
			this.crown = this.game.add.sprite(w2, -32, 'crown');
			this.crown.anchor.setTo(0.5,0.8);
			this.game.physics.enable(this.crown, Phaser.Physics.ARCADE);
		}

		if(numberPlayers > 0){
			graphics.lineStyle(0);
			graphics.beginFill(0x000000, 0.2);
			this.timeCircle = graphics.drawCircle(w2,h2,Math.sqrt(w2*w2+h2*h2)*2);
			this.timeCircle.pivot.x = w2;
			this.timeCircle.pivot.y = h2;
		} else {
			var textSize = 15;
	  	if (mobile) {
	  		textSize = 30
	  	}
			powerText = this.game.add.text(this.x, this.y, "1",
			{ font: "" + textSize + "px Arial Black",
	      fill: "#ffffff",
	      align: "center"
	  	});
	  	powerText.anchor.setTo(0.5,0.5);

		}

		this.initialTime = this.game.time.totalElapsedSeconds();

		//Generate powers
		if (numberPlayers > 0) {
			this.powerTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.createPower, this);
		} else {
			this.createPower();
		}

		this.overlay = this.game.add.sprite(0, 0, 'overlay');
		this.overlay.width = w2*2;
		this.overlay.height = h2*2;
		this.overlay.alpha = 0;

		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.pause, this);
		menuMusic.volume = 1;	
	},

	update: function() {
		if(!paused){
			if (menuMusic.isPlaying && (menuMusic.volume == 1) && !gameOver) {
				menuMusic.fadeOut(2000);
			}
			totalTime += this.game.time.physicsElapsed;

			
			if (!gameOver) {
				//Give crown
				if (crowned != -1) {
					players[crowned].addCrown();
				}
				if(numberPlayers>0 && this.gameTime >= (totalTime)){
					this.timeCircle.scale.set((-1/this.gameTime)*(totalTime)+1);
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

	createPower: function() {
		var powerup = new PowerUp(this.game);
		powerup.create();
	},

	decreaseTimeBar: function(timeCut){
		this.timeBar.width=this.timeBar.width-timeCut;
	},

	endGame: function(){
		if(!gameOver){
			menuMusic.play();
			menuMusic.volume = 1;
			this.game.input.onDown.active = false;
			this.game.time.events.add(Phaser.Timer.SECOND * 1, function() {
			this.game.input.onDown.active = true;
			}, this);

			this.overlay.alpha = 0.5;
			if (numberPlayers > 0) {
				this.game.time.events.remove(this.powerTimer);
				this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function(){this.game.state.restart(true,false,numberPlayers);}, this);
			}

	  		restartButton = this.game.add.button(w2+97, h2-97,"restart_button",function(){this.game.state.restart(true,false,numberPlayers);},this);
			restartButton.scale.set(1,1);
			restartButton.anchor.setTo(0.5,0.5);
			restartButton.input.useHandCursor=true;

		    mainMenu = this.game.add.button(w2-97, h2-97,"exit_button",function(){this.game.state.start("Menu");},this);
		    mainMenu.scale.set(1,1);
			mainMenu.anchor.setTo(0.5,0.5);
			mainMenu.input.useHandCursor=true;

			if(mobile){
				pauseSprite.alpha = 0;
				pauseSprite.input.useHandCursor=false;
			}

		  	if(numberPlayers > 0){
		  		//console.log("right now:" + crowned);
		  		if (crowned == -1) {
						scoreInMenu = this.game.add.text(w2, h2+128,
		  			"It's a tie",
			  		{
			        font: "80px Dosis Extrabold",
			        fill: "#ffffff",
			        align: "center"});
		  		} else {
		  			scoreInMenu = this.game.add.text(w2, h2+128,
		  			"Player " + String.fromCharCode(players[crowned].key) + " wins",
			  		{
			        font: "80px Dosis Extrabold",
			        fill: colorPlayers[crowned],
			        align: "center"});
		  		}
	    		scoreInMenu.anchor.setTo(0.5,0.5);
		  		scoreInMenu.scale.set(1,1);
		  		
		  	}

	    	if(numberPlayers == 0){
				spScoreLabel = this.game.add.button(w2, h2+97,"score-stat");
				spScoreLabel.scale.set(1,1);
				spScoreLabel.anchor.setTo(0.5,0.5);
				spScoreLabel.alpha = 0.7;
				statsPlayers = this.game.add.text(w2+50, h2+105, bestScore, {
			      font: "100px Dosis Extrabold",
			      fill: bgColorsDark[chosenColor],
			      align: "center"
		    	});
		    	statsPlayers.anchor.setTo(0.5,0.5);
	    	}
		  	gameOver = true;
		}
	},

	pause: function() {
		if (!paused) { //pause
			if(gameOver) {
				this.game.state.start("Menu");
			}
			this.overlay.alpha = 0.5;

			if(pauseTween){
				pauseTween.stop();
			}
			paused = true;
			this.game.input.onDown.active = false;

			if(mobile){
				pauseSprite.alpha = 0;
			} else if (numberPlayers == 0){
				tempLabel.alpha = 0;
				tempLabelText.alpha = 0;
			}

			if (numberPlayers > 0) {
				this.game.time.events.remove(this.powerTimer);
			}

	        // Then add the menu
	        menu = this.game.add.button(w2, h2-150, 'resume_button',function(){this.pause();},this);
	        menu.anchor.setTo(0.5, 0.5);
	        menu.scale.set(1,1);
	        menu.input.useHandCursor=true;

	        restart = this.game.add.button(w2-150, h2, 'restart_button',function(){this.game.state.restart();},this);
	        restart.anchor.setTo(0.5, 0.5);
	        restart.scale.set(1,1);
	        restart.input.useHandCursor=true;

	        exit = this.game.add.button(w2, h2+150, 'exit_button',function(){this.game.state.start("Menu");},this);
	        exit.anchor.setTo(0.5, 0.5);
	        exit.scale.set(1,1);
	        exit.input.useHandCursor=true;

	        if(this.game.sound.mute){
		    	audioButton = this.game.add.button(w2+150, h2,"audiooff_button",this.muteSound,this);
		  		audioButton.anchor.setTo(0.5,0.5);
		  		audioButton.scale.set(1,1);
		  		audioButton.input.useHandCursor=true;
		    }
		    else{
		        audioButton = this.game.add.button(w2+150, h2,"audio_button",this.muteSound,this);
		        audioButton.anchor.setTo(0.5,0.5);
		        audioButton.scale.set(1,1);
		        audioButton.input.useHandCursor=true;
		    }
			
		}else { //unpause
			this.overlay.alpha = 0;
			if (numberPlayers > 0) {
				this.powerTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.createPower, this);
			}
			this.game.input.onDown.active = true;
			if(mobile){
				pauseSprite.alpha = 0.1;
				pauseSprite.input.useHandCursor=true;
			}
			menu.destroy();
            restart.destroy();
            exit.destroy();
            audioButton.destroy();
            paused = false;
		}

	},

	touchePauseButton: function(){
		if(!paused){
			this.pause();
			if(mobile){
				pauseSprite.input.useHandCursor=false;
			}
		}	
	},

	componentToHex: function(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	},

	muteSound: function(){
    if(this.game.sound.mute){
	    audioButton.loadTexture('audio_button');
	    this.game.sound.mute = false;
    }
    else{
        audioButton.loadTexture('audiooff_button');
        this.game.sound.mute = true;
    }
	},

	render: function(){
		//players[0].render();
		for(var i = 0; i<groupTrails.length; i++ ){
			groupTrails[i].forEachAlive(this.renderGroup, this);
		}
	},

	renderGroup: function(member) {
		//this.game.debug.body(member);
	}
};