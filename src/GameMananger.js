var gameMananger = function(game) {}

gameMananger.prototype = {
	init: function(){
		this.crown = null;
		highScore = 0;
		crowned = -1;
		players = [];
		this.timeCircle = null;
		this.gameTime = 10; //sec 
		this.initialTime = 0;
		lastCrowned = 0;
		if (numberPlayers > 0) {
			this.game.world.scale.set((-1/24)*numberPlayers+7/12);
		}
		w2 = (this.game.world.width/2)/this.game.world.scale.x;
		h2 = (this.game.world.height/2)/this.game.world.scale.x;
		gameOver = false;
		graphics = this.game.add.graphics(w2, h2);
		muteAudio = false;
		paused = false;
		this.powerTimer = null;
		totalTime = 0;
		pauseTween = null;
	},

	create: function() {
		if (numberPlayers > 0) {
			this.game.stage.backgroundColor = bgColorsDark[chosenColor];
		} else {
			document.body.style.background = bgColorsDark[chosenColor];
		}

		if(mobile){
			pauseSprite = this.game.add.button(w2, h2, 'pauseButton',this.touchePauseButton,this);
	    	pauseSprite.anchor.setTo(0.5, 0.5);
	    	pauseSprite.input.useHandCursor=true;
		}

		//Choose snake locations
		for(var i=0; i <= numberPlayers; i++){
			players[i] = new Player(i,
			Math.round(Math.cos((2*Math.PI/(numberPlayers+1))*i)*500/this.game.world.scale.x)+w2, 
			Math.round(Math.sin((2*Math.PI/(numberPlayers+1))*i)*250/this.game.world.scale.y)+h2, 
			keys[i], this.game);
		}

		groupPowers = this.game.add.group();
		groupTrails = [];

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 0;

		for(var i=0; i <= numberPlayers; i++){
			players[i].create();
			players[i].player.rotation = ((2*Math.PI/(numberPlayers+1))*i);
		}

		for(var i=0; i <= numberPlayers; i++){
			for (var j = 0; j < groupTrails.length; j++) {
				if (groupTrails[j] != players[i].groupTrail) {
					players[i].enemyTrails.push(groupTrails[j]);
				}
			}
		}

		if(numberPlayers > 0){
			this.crown = this.game.add.sprite(w2, -32/this.game.world.scale.y, 'crown');
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

		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.pause, this);	
	},

	update: function() {
		if(!paused){
			totalTime += this.game.time.physicsElapsed;

			//Give crown
			if (crowned != -1) {
				if (Math.abs(this.crown.x - players[crowned].player.x) < 30 && Math.abs(this.crown.y - players[crowned].player.y) < 30) {
					players[crowned].addCrown();

					this.crown.x = players[crowned].player.x;
					this.crown.y = players[crowned].player.y;
					this.crown.visible = false;
				} else {
					this.game.physics.arcade.moveToObject(this.crown, players[crowned].player, 800);
					this.crown.visible = true;
				}
			}
			if(numberPlayers>0 && this.gameTime >= (totalTime)){
				this.timeCircle.scale.set((-1/this.gameTime)*(totalTime)+1);
			}
			else if(numberPlayers>0){
				this.endGame();
			}

			else if(players[0].dead){
				this.endGame();
			}

			if(muteAudio && !this.game.mute){
				audioButton.loadTexture('audiooff_button');
		        this.game.sound.mute = true;
			}
			else if(!muteAudio && this.game.mute){
				audioButton.loadTexture('audio_button');
		        this.game.sound.mute = false;
			}
		}

		//Update players
		for(var i=0; i <= numberPlayers; i++){
			players[i].update();
		}
	},

	createPower: function() {
		var powerup = new PowerUp(this.game);
		powerup.preload();
		powerup.create();
	},

	decreaseTimeBar: function(timeCut){
		this.timeBar.width=this.timeBar.width-timeCut;
	},

	endGame: function(){
		if(!gameOver){
			if (numberPlayers > 0) {
				this.game.time.events.remove(this.powerTimer);
			}
			for(var i = 0; i<players.length; i++){
				players[i].kill();
			}

	  	restartButton = this.game.add.button(w2+97/this.game.world.scale.x, h2-97/this.game.world.scale.x,"restart_button",function(){this.game.state.restart(true,false,numberPlayers);},this);
			restartButton.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
			restartButton.anchor.setTo(0.5,0.5);
			restartButton.input.useHandCursor=true;

	    mainMenu = this.game.add.button(w2-97/this.game.world.scale.x, h2-97/this.game.world.scale.x,"exit_button",function(){this.game.state.start("Menu");},this);
	    mainMenu.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
			mainMenu.anchor.setTo(0.5,0.5);
			mainMenu.input.useHandCursor=true;

			if(mobile){
				pauseSprite.alpha = 0;
				pauseSprite.input.useHandCursor=false;
			}

		  	if(numberPlayers > 0){
		  		scoreInMenu = this.game.add.text(w2, h2+256/this.game.world.scale.x, "player " + lastCrowned + " with: " + highScore, {
		        font: "40px Arial",
		        fill: "#ff0044",
		        align: "center"});
	    		scoreInMenu.anchor.setTo(0.5,0.5);
		  		scoreInMenu.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
		  	}

	    	if(numberPlayers == 0){
					spScoreLabel = this.game.add.button(w2, h2+97/this.game.world.scale.x,"score-stat");
					spScoreLabel.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
					spScoreLabel.anchor.setTo(0.5,0.5);
					spScoreLabel.alpha = 0.7;
					statsPlayers = this.game.add.text(w2+50, h2+105/this.game.world.scale.x, bestScore, {
			      font: "100px Dosis Extrabold",
			      fill: colorHex,
			      align: "center"
		    	});
		    	statsPlayers.anchor.setTo(0.5,0.5);
	    	}
		  	gameOver = true;
		}
	},

	pause: function() {
		if (!paused) { //pause
			if(pauseTween){
				pauseTween.stop();
			}
			paused = true;
			this.game.input.onDown.active = false;

			if(mobile){
				pauseSprite.alpha = 0;
				pauseSprite.callBack
			}

			if (numberPlayers > 0) {
				this.game.time.events.remove(this.powerTimer);
			}

	        // Then add the menu
	        menu = this.game.add.button(w2, h2-150/this.game.world.scale.x, 'resume_button',function(){this.pause();},this);
	        menu.anchor.setTo(0.5, 0.5);
	        menu.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
	        menu.input.useHandCursor=true;

	        restart = this.game.add.button(w2-150/this.game.world.scale.x, h2, 'restart_button',function(){this.game.state.restart();},this);
	        restart.anchor.setTo(0.5, 0.5);
	        restart.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
	        restart.input.useHandCursor=true;

	        exit = this.game.add.button(w2, h2+150/this.game.world.scale.x, 'exit_button',function(){this.game.state.start("Menu");},this);
	        exit.anchor.setTo(0.5, 0.5);
	        exit.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
	        exit.input.useHandCursor=true;

	        if(this.game.sound.mute){
		    	audioButton = this.game.add.button(w2+150/this.game.world.scale.x, h2,"audiooff_button",this.muteSound,this);
		  		audioButton.anchor.setTo(0.5,0.5);
		  		audioButton.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
		  		audioButton.input.useHandCursor=true;
		    }
		    else{
		        audioButton = this.game.add.button(w2+150/this.game.world.scale.x, h2,"audio_button",this.muteSound,this);
		        audioButton.anchor.setTo(0.5,0.5);
		        audioButton.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
		        audioButton.input.useHandCursor=true;
		    }
			
		}else { //unpause
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
		//groupPowers.forEachAlive(this.renderGroup, this);
	},

	renderGroup: function(member) {
		this.game.debug.body(member);
	}
};