var preloadGame = function (game) {
	this.mode = null;
};

preloadGame.prototype = {
	init: function (mode) {
		this.mode = mode;
	},

	preload: function () { 
		this.scale.forceOrientation(true);
		var wOrientation = Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
		if (wOrientation == "portrait") {
			Cocoon.Device.setOrientation(Cocoon.Device.Orientations.PORTRAIT);
		} else {
			Cocoon.Device.setOrientation(Cocoon.Device.Orientations.LANDSCAPE);
		}
		
    var loadingBar = this.add.sprite(w2,h2,"loading");
    this.game.physics.enable(loadingBar, Phaser.Physics.ARCADE);
    loadingBar.anchor.setTo(0.5,0.5);
    loadingBar.body.angularVelocity = 200;
		this.game.physics.arcade.velocityFromAngle(loadingBar.angle, 300*this.speed, loadingBar.body.velocity);

		if (this.state.preload) {
			this.state.preload();
		}

    //Load all stuf from game
    this.game.load.image('score', 'assets/sprites/menu/score-general.png');
		this.game.load.image('pauseButton', 'assets/sprites/menu/pause.png');
		this.game.load.image('winner', 'assets/sprites/menu/winner.png');
		this.game.load.image('touch', 'assets/sprites/menu/touch.png');
		this.game.load.image('overlay', 'assets/overlay.png');
		this.game.load.audio('move0', 'assets/sfx/move0.ogg');
		this.game.load.audio('move1', 'assets/sfx/move1.ogg');
		this.game.load.audio('move1', 'assets/sfx/move1.ogg');
		this.game.load.audio('kill', 'assets/sfx/kill.ogg');
		this.game.load.audio('sfx_collect0', 'assets/sfx/collect0.ogg');
		this.mode.preload();

	},

  	create: function () {
		this.game.state.start("GameMananger", true, false, this.mode);
	}

};