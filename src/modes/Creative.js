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
		//console.log(Cocoon.Utils.captureScreen("myScreenshot.png"));
		Cocoon.Utils.captureScreenAsync("myScreenshot.png", Cocoon.App.StorageType.EXTERNAL_STORAGE, true, Cocoon.Utils.CaptureType.EVERYTHING, function(callback){
			console.log("Done:" + JSON.stringify(callback));
		});
	},

	update: function () {

	},

	erasesTrail: function () {
		return !this.player.ready;
	}

};
