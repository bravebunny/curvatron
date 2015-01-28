var gameMananger = function(game) {}

gameMananger.prototype = {
	init: function(numberPlayers){
		this.crown = null;
		
		this.keys = [Phaser.Keyboard.Q,Phaser.Keyboard.P,Phaser.Keyboard.Z,Phaser.Keyboard.M] 
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
			this.keys[i], this.game);
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

	},

	update: function() {

		//Update players
		for(var i=0; i <= this.numberOfPlayers; i++){
			players[i].update();
		}

		//Select crowned player
		/*for (var i = 0; i < players.length; i++) {
			for (var j = 0; j < players.length; j++) {
				if ((i != j) && players[i].size > players[j].size) {
					if (crowned != -1) {
						players[crowned].removeCrown();
					}
					crowned = i;
				}
			}
		}*/

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
		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function(){this.game.state.start("GameTitle");}, this);

	},

	createPower: function() {
		var powerup = new PowerUp(this.game.rnd.integerInRange((-this.game.world.width/2)/this.game.world.scale.x, (this.game.world.width/2)/this.game.world.scale.x), 
			this.game.rnd.integerInRange((-this.game.world.height/2)/this.game.world.scale.x, (this.game.world.height/2)/this.game.world.scale.x), this.game);
		powerup.preload();
		powerup.create();
	},

	render: function(){
		players[0].render();
	}
};