var settings = function (game) {
	this.game = game;
	this.title = null;
	this.selection = 0;
	this.audio = null;
	this.fullscreen = null;
};

settings.prototype = {
	create: function () {
		selection = this.selection;

		this.title = this.game.add.text(w2,100, "single player", {
      font: "150px dosis",
      fill: "#ffffff",
      align: "center"
  	});
  	this.title.anchor.setTo(0.5,0.5);

		menuArray = [];

		menuArray[0] = new Button(w2, 300, 'setkeys_button', 'controls', 0, this.controls, this, this.game);
		menuArray[0].create();

		menuArray[1] = new Button(w2, 425, 'audio_button', 'audio: on ', 1,  this.toggleAudio, this, this.game);
		menuArray[1].create();
		this.audio = menuArray[1];
		this.updateAudioButton();

	/*	menuArray[2] = new Button(w2, 550, 'music_button', 'music: on ', 2,  this.toggleMusic, this, this.game);
		menuArray[2].create();
		this.music = menuArray[2];*/

		menuArray[2] = new Button(w2, 550, 'fullscreen_button', 'fullscreen', 2,  this.toggleFullscreen, this, this.game);
		menuArray[2].create();
		this.fullscreen = menuArray[2];
		this.updateScreenButton();

		menuArray[3] = new Button(w2, 675, 'back_button', 'back', 3,  this.backPressed, this, this.game);
		menuArray[3].create();

		menuArray[selection].button.onInputOver.dispatch();
	},

	controls: function () {
		this.state.start("SetKeys");
	},

	toggleAudio: function() {
		mute = !mute;
		this.updateAudioButton();
	},

	updateAudioButton: function() {
		if (!mute){
			this.audio.setIcon('audio_button');
			this.audio.setText('audio: on ');
			//this.game.sound.mute = false;
			if (!menuMusic) {
				menuMusic = this.add.audio('dream');
			}
			menuMusic.loop = true;
			menuMusic.volume = 1;
			if (!menuMusic.isPlaying) {

				menuMusic.play();
			}
		} else {
			this.audio.setIcon('audiooff_button');
			this.audio.setText('audio: off');
			//this.game.sound.mute = true;
			if (menuMusic && menuMusic.isPlaying) {
				menuMusic.stop();
			}
		}
	},

	toggleFullscreen: function() {
		if (typeof variable_here !== 'undefined') {
			var gui = require('nw.gui');
			var win = gui.Window.get();
			win.toggleFullscreen();
			this.updateScreenBUtton();
		}
	},

	updateScreenButton: function() {
		if (typeof variable_here !== 'undefined') {
			var gui = require('nw.gui');
			var win = gui.Window.get();
			if (win.isFullscreen) {
				this.fullscreen.setText('windowed');
				this.fullscreen.setIcon('windowed_button');
			} else {
				this.fullscreen.setText('fullscreen');
				this.fullscreen.setIcon('fullscreen_button');
			}
		}
	},

	update: function() {
		menuUpdate();
	},

	backPressed: function () {
		this.game.state.start("Menu");
	}

};
