var Creative = function (game) {
	this.sp = true;
	this.game = game;
	this.player = null;
	this.leaderboardID = null;
	this.noCollisions = true;
};

Creative.prototype = {

	preload: function () {
		this.game.load.image('player0', 'assets/playerSingle.png');
		this.game.load.image('trail0', 'assets/trailSingle.png');
	},

	create: function () {
		this.player = players[0];
		scale = 0.3;
		
	},

	update: function () {

	},

	erasesTrail: function () {
		return !this.player.ready;
	}

};