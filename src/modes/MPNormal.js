var MPNormal = function(nPlayers, game) {
	this.game = game;
	this.nPlayers = nPlayers;
	this.spawnPowers = true;
	this.highScore = 0;
	this.gridded = true;
	this.highScoreAux = true;
};

MPNormal.prototype = {

	preload: function () {
		this.game.load.image('point', 'assets/pointMP.png');
		this.game.load.image('tie', 'assets/sprites/menu/tie.png');
		this.game.load.image('crown', 'assets/crown.png');
		for (var i=0; i <= this.nPlayers; i++) {
			this.game.load.image('player' + i, 'assets/player' + i +'.png');
			this.game.load.image('crown' + i, 'assets/crown'+ i +'.png');
			this.game.load.image('trail' + i, 'assets/trail'+ i +'.png');
		}
	},

	create: function () {
		this.highScoreAux = true;
		this.highScore = 0;
		spawnPowers = true;
		var textSize = 15;
  	if (mobile) {
  		textSize = 30
  	}

		powerText = this.game.add.text(0, 0, "1", {
		font: "" + textSize + "px dosis",
      	fill: "#ffffff",
      	align: "center"
  	});
  	powerText.anchor.setTo(0.5,0.5);
	},

	update: function () {

	},

	erasesTrail: function () {
		return true;
	},

	collect: function (playerSprite, powerSprite, player) {
		
		if (player.score > this.highScore || this.highScoreAux) {
			this.highScoreAux = false;
			this.highScore = player.score;
			if(crowned > -1){
				players[crowned].removeCrown();
			}
			crowned = player.id;
			lastCrowned = crowned+1;
		}

		player.growth = 60*powerSprite.scale.x;
		
	},

	kill: function () {
		var alreadyDead = 0;
		for (var i = 0; i < players.length; i++) {
			if (players[i].dead) {
				alreadyDead++;
			}
		}

		var newMax = 0;
		for (var i = 0; i < players.length; i++) {
			if (players.length - alreadyDead == 1 && i != this.id && !players[i].dead) {
				newMax = players[i].score;
				crowned = i;
			} else if (i != this.id && players[i].score > newMax && !players[i].dead) {
				newMax = players[i].score;
				crowned = i;
			}
		}

		if (crowned != -1 && players[crowned].dead) {
			crowned = -1;
			this.highScore = 0;
		}
	},

	getHighScore: function () {
		return this.highScore;
	},

	setHighScore: function (score) {
		this.highScore = score;
	}, 

};