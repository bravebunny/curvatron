var gameMananger = function(game) {
	this.crown = null;
	this.players = [];
	this.crowned = -1;
	this.numberOfPlayers = 0; 
}
	
gameMananger.prototype = {
	init: function(numberPlayers){
		this.numberOfPlayers = numberPlayers;
	},

	preload: function() {
		this.game.load.image('power', 'assets/power.png');
		this.game.load.image('player1', 'assets/player1.png');
		this.game.load.image('player2', 'assets/player2.png');
		this.game.load.image('trail1', 'assets/trail1.png');
		this.game.load.image('trail2', 'assets/trail2.png');
		this.game.load.image('crown', 'assets/crown.png');

		this.players[0] = new Player(1, 100, 380, Phaser.Keyboard.A, this.game);
		this.players[1] = new Player(2, 1000, 380, Phaser.Keyboard.L, this.game);
	},

	create: function() {
		groupPowers = this.game.add.group();
		groupTrails = [];

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 0;

		for(var i=0; i <= this.numberOfPlayers; i++){
			this.players[i].create();
		}

		this.crown = this.game.add.sprite(683, 10, 'crown');
		this.crown.anchor.setTo(0.5,0.8);
		this.game.physics.enable(this.crown, Phaser.Physics.ARCADE);

		this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.createPower, this);

	},

	update: function() {
		for(var i=0; i <= this.numberOfPlayers; i++){
			this.players[i].update();
		}

		for (var i = 0; i < this.players.length; i++) {
			for (var j = 0; j < this.players.length; j++) {
				if ((i != j) && this.players[i].size > this.players[j].size) {
					this.crowned = i;
				}
			}
		}
		if (this.crowned != -1) {
			if (Math.abs(this.crown.x - this.players[this.crowned].player.x) < 30 && Math.abs(this.crown.y - this.players[this.crowned].player.y) < 30) {
				this.crown.x = this.players[this.crowned].player.x;
				this.crown.y = this.players[this.crowned].player.y;
				//this.crown.rotation = this.players[this.crowned].player.rotation;
			} else {
				this.game.physics.arcade.moveToObject(this.crown, this.players[this.crowned].player, 800);
			}
		}


		/*if (this.crowned != this.oldCrowned) {
			console.log("oi")
			var tween = this.game.add.tween(this.crown).to( { x: this.players[this.crowned].x, y: this.players[this.crowned].y }, 2400, Phaser.Easing.Bounce.Out, true);
			this.oldCrowned = this.crowned;
		}*/

	},

	createPower: function() {
		var powerup = new PowerUp(this.game.rnd.integerInRange(10, 1356), this.game.rnd.integerInRange(10, 758), this.game);
		powerup.preload();
		powerup.create();
	},

	render: function(){
	}
};