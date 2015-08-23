var Creative = function (game) {
	this.sp = true;
	this.game = game;
	this.player = null;
	this.leaderboardID = null;
	this.noCollisions = true;
};

Creative.prototype = {

	preload: function () {
		this.game.load.image('player0', 'assets/sprites/game/singleplayer/player.png');
		this.game.load.image('screenshotButton', 'assets/sprites/gui/hud/screenshot.png');
	},

	create: function () {
		this.player = players[0];
		scale = 0.3;
		var screenShotSprite = this.game.add.button(100, 100, 'screenshotButton', this.takeScreenShot, this);
		screenShotSprite.anchor.setTo(0.5, 0.5);
		screenShotSprite.input.useHandCursor = true;
		screenShotSprite.scale.set(0.5);
		screenShotSprite.alpha = 0.2;

	},

	takeScreenShot: function() {
		this.game.canvas.toBlob(function(blob) {
	    saveAs(blob, "creative.png");
		});
	},

	update: function () {

	},

	erasesTrail: function () {
		return !this.player.ready;
	}

};
