var MPNormal = function(nPlayers, game) {
	this.game = game;
	this.nPlayers = nPlayers;
	this.spawnPowers = true;
};

MPNormal.prototype = {

	preload: function () {
		this.game.load.image('tie', 'assets/sprites/menu/tie.png');
		this.game.load.image('crown', 'assets/crown.png');
		for (var i=0; i <= numberPlayers; i++) {
			this.game.load.image('player' + i, 'assets/player' + i +'.png');
			this.game.load.image('crown' + i, 'assets/crown'+ i +'.png');
			this.game.load.image('trail' + i, 'assets/trail'+ i +'.png');
		}
	},

	create: function () {

		spawnPowers = true;


	},

	update: function () {

	},

	erasesTrail: function () {
		return true;
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
			highScore = 0;
		}
	},

	getHighScore: function () {
		return highScore;
	},

	setHighScore: function (score) {
		highScore = score;
	}, 

};