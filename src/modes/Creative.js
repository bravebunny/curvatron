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

	    //saveAs(blob, "creative.png");
		});

		var png = this.game.canvas.toDataURL();
		png = png.replace(/^data:image\/png;base64,/, "");
		var fs = require("fs");
		var path = require("path");
		var process = require("process");

		var root = path.dirname(process.execPath);
		var savePath = root + '/tmp/screenshot.png';
		fs.mkdir(root + "/tmp");

		//Save
		fs.writeFile(savePath, png, 'base64', function (err) {
		    if (err) throw err;
		});



		var Twitter = require('node-twitter');

		var twitterRestClient = new Twitter.RestClient(
				'NwssUgdW5A1dKhtzExUFc5AtQ',
				'S4yhhvUDPKAEI4Wqwx9TCqLaQgsdcB8FjhPG6GyMLVK1xzgqeV',
				'234170272-Qqcb4osrZo2Nb00dvQ9B8qzkFntiacQfDjmkTxca',
				'NHzJE8Yek8xG8Dn28ZoGxxpKNJTDvpi6L2OLaguzDLN8t'
		);

		twitterRestClient.statusesUpdateWithMedia({
			'status': 'I made art with #Curvatron',
			'media[]': savePath
		}, function(error, result) {});

	},

	update: function () {

	},

	erasesTrail: function () {
		return !this.player.ready;
	}

};
