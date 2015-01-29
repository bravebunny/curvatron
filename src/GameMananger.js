var gameMananger = function(game) {}

gameMananger.prototype = {
	init: function(numberPlayers){
		this.crown = null;
		this.numberOfPlayers = numberPlayers;

		this.game.world.scale.set((-1/24)*numberPlayers+7/12);
		highScore = 0;
		crowned = -1;
		players = [];
	},

	create: function() {
		//Choose snake locations
		for(var i=0; i <= this.numberOfPlayers; i++){
			players[i] = new Player(i,
			Math.round(Math.cos((2*Math.PI/(this.numberOfPlayers+1))*i)*500/this.game.world.scale.x), 
			Math.round(Math.sin((2*Math.PI/(this.numberOfPlayers+1))*i)*250/this.game.world.scale.y), 
			keys[i], this.game);
		}

		groupPowers = this.game.add.group();
		groupTrails = [];

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 0;

		for(var i=0; i <= this.numberOfPlayers; i++){
			players[i].create();
			players[i].player.rotation = ((2*Math.PI/(this.numberOfPlayers+1))*i);
		}

		for(var i=0; i <= this.numberOfPlayers; i++){
			for (var j = 0; j < groupTrails.length; j++) {
				if (groupTrails[j] != players[i].groupTrail) {
					players[i].enemyTrails.push(groupTrails[j]);
				}
			}
		}

		this.crown = this.game.add.sprite(683, 10, 'crown');
		this.crown.anchor.setTo(0.5,0.8);
		this.game.physics.enable(this.crown, Phaser.Physics.ARCADE);

		this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.createPower, this);

		/////////////////////////////////////////////////////////////////////////////////////////////
			// Create a label to use as a button
	    this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function () {
	    	if(!this.game.paused){
		        // When the paus button is pressed, we pause the game
		        this.game.paused = true;

		        // Then add the menu
		        menu = this.game.add.sprite(0, 0, 'play');
		        menu.anchor.setTo(0.5, 0.5);
		        menu.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);

		        back = this.game.add.sprite(0, 64/this.game.world.scale.x, 'auxBar');
		        back.anchor.setTo(0.5, 0.5);
		        back.scale.set(1/this.game.world.scale.x,1/this.game.world.scale.x);
		    }
		    else{
          menu.destroy();
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
	            var x1 = this.game.width/2 - 128, x2 = this.game.width/2 + 128, //128+128 é o tamanho da imagem
	                y1 = this.game.height/2 - 16, y2 = this.game.height/2 + 16;
     
	            // Check if the click was inside the menu*/
	           if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
	                // Remove the menu and the label
	                menu.destroy();
	                back.destroy();
	                // Unpause the game
	                this.game.paused = false;
	            }

	             if((event.x > x1) && (event.x < x2) && (event.y > (y1+64)) && (event.y < (y2+64) )){
	             	this.game.paused = false;
	            	this.game.state.start("GameTitle");
	            }
	        }
	    };
	},

	update: function() {

		//Update players
		for(var i=0; i <= this.numberOfPlayers; i++){
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

		//Controls
		this.game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(function(){this.game.state.start("GameMananger",true,false,this.numberOfPlayers);}, this);

	},

	createPower: function() {
		var powerup = new PowerUp(this.game.rnd.integerInRange((-this.game.world.width/2)/this.game.world.scale.x, (this.game.world.width/2)/this.game.world.scale.x), 
			this.game.rnd.integerInRange((-this.game.world.height/2)/this.game.world.scale.x, (this.game.world.height/2)/this.game.world.scale.x), this.game);
		powerup.preload();
		powerup.create();
	},

	render: function(){
		//players[0].render();
	}
};