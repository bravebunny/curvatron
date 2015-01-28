var gameMananger = function(game) {}

gameMananger.prototype = {
	init: function(numberPlayers){
		this.crown = null;
		this.players = [];
		this.crowned = -1;
		this.keys = [Phaser.Keyboard.Q,Phaser.Keyboard.P,Phaser.Keyboard.Z,Phaser.Keyboard.M] 
		this.numberOfPlayers = numberPlayers;

		this.game.world.scale.set((-1/24)*numberPlayers+7/12);
	},

	create: function() {
		//Choose snake locations
		for(var i=0; i <= this.numberOfPlayers; i++){
			this.players[i] = new Player(i,
			Math.round(Math.cos((2*Math.PI/(this.numberOfPlayers+1))*i)*500/this.game.world.scale.x), 
			Math.round(Math.sin((2*Math.PI/(this.numberOfPlayers+1))*i)*250/this.game.world.scale.y), 
			this.keys[i], this.game);
		}

		groupPowers = this.game.add.group();
		groupTrails = [];

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 0;

		for(var i=0; i <= this.numberOfPlayers; i++){
			this.players[i].create();
			this.players[i].player.rotation = ((2*Math.PI/(this.numberOfPlayers+1))*i);
		}

		for(var i=0; i <= this.numberOfPlayers; i++){
			for (var j = 0; j < groupTrails.length; j++) {
				if (groupTrails[j] != this.players[i].groupTrail) {
					this.players[i].enemyTrails.push(groupTrails[j]);
				}
			}
		}

		this.crown = this.game.add.sprite(683, 10, 'crown');
		this.crown.anchor.setTo(0.5,0.8);
		this.game.physics.enable(this.crown, Phaser.Physics.ARCADE);

		this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.createPower, this);

	},

	update: function() {

		//Update players
		for(var i=0; i <= this.numberOfPlayers; i++){
			this.players[i].update();
		}

		//Select crowned player
		for (var i = 0; i < this.players.length; i++) {
			for (var j = 0; j < this.players.length; j++) {
				if ((i != j) && this.players[i].size > this.players[j].size) {
					if (this.crowned != -1) {
						this.players[this.crowned].removeCrown();
					}
					this.crowned = i;
				}
			}
		}

		//Give crown
		if (this.crowned != -1) {
			if (Math.abs(this.crown.x - this.players[this.crowned].player.x) < 30 && Math.abs(this.crown.y - this.players[this.crowned].player.y) < 30) {
				this.players[this.crowned].addCrown();
				this.crown.x = this.players[this.crowned].player.x;
				this.crown.y = this.players[this.crowned].player.y;
				//this.crown.rotation = this.players[this.crowned].player.rotation;
				this.crown.visible = false;
			} else {
				this.game.physics.arcade.moveToObject(this.crown, this.players[this.crowned].player, 800);
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
		this.players[0].render();
	}
};