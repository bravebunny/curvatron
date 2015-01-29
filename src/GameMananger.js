var gameMananger = function(game) {}

gameMananger.prototype = {
	init: function(){
		this.crown = null;
		this.game.world.scale.set((-1/24)*numberPlayers+7/12);
		highScore = 0;
		crowned = -1;
		players = [];
		this.timeBar = null;
		this.gameTime = 10; //sec 
		this.initialTime = 0;
		w2 = (this.game.world.width/2)/this.game.world.scale.x;
		h2 = (this.game.world.height/2)/this.game.world.scale.x;
	},

	create: function() {

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

		this.crown = this.game.add.sprite(0, -(h2+32)/this.game.world.scale.y, 'crown');
		this.crown.anchor.setTo(0.5,0.8);
		this.game.physics.enable(this.crown, Phaser.Physics.ARCADE);

		if(numberPlayers>0){
			this.timeBar = this.game.add.sprite(0, 0, 'gametitle');
		}
		this.initialTime = this.game.time.totalElapsedSeconds();

		//Pause Game
		this.pauseGame();

		//Generate powers
		this.game.time.events.loop(Phaser.Timer.SECOND * 8, this.createPower, this);
		
	},

	update: function() {

		//Update players
		for(var i=0; i <= numberPlayers; i++){
			players[i].update();
		}

		//Give crown
		if (crowned != -1) {
			if (Math.abs(this.crown.x - players[crowned].player.x) < 30 && Math.abs(this.crown.y - players[crowned].player.y) < 30) {
				players[crowned].addCrown();
				this.crown.x = players[crowned].player.x;
				this.crown.y = players[crowned].player.y;
				//this.crown.rotation = players[crowned].player.rotation;
				this.crown.visible = false;
			} else {
				this.game.physics.arcade.moveToObject(this.crown, players[crowned].player, 800);
				this.crown.visible = true;
			}
		}
		if(numberPlayers>0 && this.gameTime >= (this.game.time.totalElapsedSeconds()-this.initialTime)){
			this.timeBar.scale.x = (-1/this.gameTime)*(this.game.time.totalElapsedSeconds()-this.initialTime)+1;
		}
		else if(numberPlayers>0){
			this.endGame();
		}

	},

	createPower: function() {
		var powerup = new PowerUp(this.game.rnd.integerInRange((-w2+32)/this.game.world.scale.x, (w2-32)/this.game.world.scale.x), 
			this.game.rnd.integerInRange((-h2+32)/this.game.world.scale.x, (h2-32)/this.game.world.scale.x), this.game);
		powerup.preload();
		powerup.create();
	},

	decreaseTimeBar: function(timeCut){
		this.timeBar.width=this.timeBar.width-timeCut;
	},

	endGame: function(){
		for(var i = 0; i<players.length; i++){
				players[i].kill();
			}
		highScore = this.game.add.sprite(w2, h2, 'play');
        highScore.anchor.setTo(0.5, 0.5);
        highScore.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);

        score = this.game.add.sprite(w2, h2+64/this.game.world.scale.x, 'auxBar');
        score.anchor.setTo(0.5, 0.5);
        score.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);

        backButton = this.game.add.button(w2, h2+128/this.game.world.scale.x,"play",function(){this.game.state.start("GameTitle");},this);
		backButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(w2, h2+128/this.game.world.scale.x, "Main Menu", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

    	restartButton = this.game.add.button(w2, h2+192/this.game.world.scale.x,"play",function(){this.game.state.restart(true,false,numberPlayers);},this);
		restartButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(w2, h2+192/this.game.world.scale.x, "Restart", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);
	},

	pauseGame:function(){
		// Create a label to use as a button
	    this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function () {
	    	if(!this.game.paused){
		        // When the paus button is pressed, we pause the game
		        this.game.paused = true;

		        // Then add the menu
		        menu = this.game.add.sprite(w2, h2, 'play');
		        menu.anchor.setTo(0.5, 0.5);
		        menu.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);

		        restart = this.game.add.sprite(w2, h2+64/this.game.world.scale.x, 'auxBar');
		        restart.anchor.setTo(0.5, 0.5);
		        restart.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);

		        back = this.game.add.sprite(w2, h2+128/this.game.world.scale.x, 'auxBar');
		        back.anchor.setTo(0.5, 0.5);
		        back.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
		    }
		    else{
          menu.destroy();
          restart.destroy();
          back.destroy();
          this.game.paused = false;
		    }

	    }, this);

	    // Add a input listener that can help us return from being paused
	    this.game.input.onDown.add(unpause, this);

	    // And finally the method that handels the pause menu
	    function unpause(event){
	        // Only act if paused
	        if(this.game.paused){
	            // Calculate the corners of the menu
	            var x1 = this.game.world.width/2 - 128, x2 = this.game.world.width/2 + 128, //128+128 é o tamanho da imagem
	                y1 = this.game.world.height/2 - 16, y2 = this.game.world.height/2 + 16;
     
	            // Check if the click was inside the menu*/
	           if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
	                // Remove the menu and the label
	                menu.destroy();
	                restart.destroy();
	                back.destroy();
	                // Unpause the game
	                this.game.paused = false;
	            }

	            if((event.x > x1) && (event.x < x2) && (event.y > (y1+64)) && (event.y < (y2+64) )){
	             	this.game.paused = false;
	            	this.game.state.restart();
	            }

	            if((event.x > x1) && (event.x < x2) && (event.y > (y1+128)) && (event.y < (y2+128) )){
	             	this.game.paused = false;
	            	this.game.state.start("GameTitle");
	            }

	        }
	    };
	},

	render: function(){
		//players[0].render();
	}
};