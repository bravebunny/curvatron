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
		if (numberPlayers > 0) {
			this.game.world.scale.set((-1/24)*numberPlayers+7/12);
		}
		w2 = (this.game.world.width/2)/this.game.world.scale.x;
		h2 = (this.game.world.height/2)/this.game.world.scale.x;
		gameOver = false;
		graphics = this.game.add.graphics(w2, h2);

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

		this.crown = this.game.add.sprite(w2, -32/this.game.world.scale.y, 'crown');
		this.crown.anchor.setTo(0.5,0.8);
		this.game.physics.enable(this.crown, Phaser.Physics.ARCADE);

		if(numberPlayers > 0){
			graphics.lineStyle(0);
			graphics.beginFill(0x111111, 1);
			this.timeCircle = graphics.drawCircle(w2,h2,Math.sqrt(w2*w2+h2*h2)*2);
			this.timeCircle.pivot.x = w2;
			this.timeCircle.pivot.y = h2;
		} else {
			powerText = this.game.add.text(this.x, this.y, "1",
				{ font: "15px Arial Black",
		      fill: "#ffffff",
		      align: "center"
		  	});
	  	powerText.anchor.setTo(0.5,0.5);
		}
		this.initialTime = this.game.time.totalElapsedSeconds();

		//Pause Game
		this.pauseGame();

		//Generate powers
		if (numberPlayers > 0) {
			this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.createPower, this);
		} else {
			this.createPower();
		}
		
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
			this.timeCircle.scale.set((-1/this.gameTime)*(this.game.time.totalElapsedSeconds()-this.initialTime)+1)	
		}
		else if(numberPlayers>0){
			this.endGame();
		}

		else if(players[0].dead){
			this.endGame();
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
		for(var i = 0; i<players.length; i++){
				players[i].kill();
			}
		/*highScore = this.game.add.sprite(w2, h2, 'play');
	    highScore.anchor.setTo(0.5, 0.5);
	    highScore.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);

	    score = this.game.add.sprite(w2, h2+64/this.game.world.scale.x, 'auxBar');
	    score.anchor.setTo(0.5, 0.5);
	    score.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);*/

	    backButton = this.game.add.button(w2, h2+128/this.game.world.scale.x,"play",function(){this.game.state.start("GameTitle");},this);
	    backButton.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);

		backButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(w2, h2+128/this.game.world.scale.x, "Main Menu", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
	  	text.anchor.setTo(0.5,0.5);
			text.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);

	  	restartButton = this.game.add.button(w2, h2+192/this.game.world.scale.x,"play",function(){this.game.state.restart(true,false,numberPlayers);},this);
		restartButton.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
		restartButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(w2, h2+192/this.game.world.scale.x, "Restart", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
	  	text.anchor.setTo(0.5,0.5);
	  	text.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
	  	gameOver = true;
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
		//groupPowers.forEachAlive(this.renderGroup, this);
	},

	renderGroup: function(member) {
		this.game.debug.body(member);
	}
};