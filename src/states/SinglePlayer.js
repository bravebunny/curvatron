var singlePlayer = function (game) {
	this.ui = {};
	this.ui.buttons = [];
	this.bestScore = 0;
	this.bestSurvScore = 0;
	this.selection = 0;
};

singlePlayer.prototype = {
	create: function () {
		var ui = this.ui;

		ui.title = this.game.add.text(w2,100, "single player", {
      font: "150px dosis",
      fill: "#ffffff",
      align: "center"
  	});
  	ui.title.anchor.setTo(0.5,0.5);

		ui.buttons[0] = new Button(w2, 300, 'collecting_button', 'normal', this.playNormalGame, this.ui.buttons, this, this.game);
		ui.buttons[0].create();

		ui.buttons[1] = new Button(w2, 450, 'endless_button', 'endless', this.playEndlessGame, this.ui.buttons, this, this.game);
		ui.buttons[1].create();

		ui.buttons[2] = new Button(w2, 600, 'oldSchool_button', 'old school', this.playOldSchoolGame, this.ui.buttons, this, this.game);
		ui.buttons[2].create();

		ui.buttons[3] = new Button(w2, 750, 'adventure_button', 'adventure', this.adventure, this.ui.buttons, this, this.game);
		ui.buttons[3].create();

		ui.buttons[4] = new Button(w2, 900, 'creative_button', 'creative', this.creative, this.ui.buttons, this, this.game);
		ui.buttons[4].create();

		ui.buttons[5] = new Button(w2, 1050, 'back_button', 'back', this.backPressed, this.ui.buttons, this, this.game);
		ui.buttons[5].create();

		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.backPressed, this);

		this.ui.buttons[this.selection].button.onInputOver.dispatch();
	},

	playNormalGame: function () {
		numberPlayers = 0;
    menuMusic.fadeOut(2000);
    var mode = new Normal(this.game);
		this.game.state.start("PreloadGame", true, false, mode);
	},

	playEndlessGame: function () {
		numberPlayers = 0;
    menuMusic.fadeOut(2000);
    // var mode = new Creative(this.game);
    var mode = new Endless(this.game);
		this.game.state.start("PreloadGame", true, false, mode);
	},

	playOldSchoolGame: function () {
		numberPlayers = 0;
    menuMusic.fadeOut(2000);
    var mode = new OldSchool(this.game);
		this.game.state.start("PreloadGame", true, false, mode);
	},

	adventure: function() {
		numberPlayers = 0;
		menuMusic.fadeOut(2000);
		var mode = new Adventure(this.game);
		this.game.state.start("PreloadGame", true, false, mode);
	},

	creative: function() {
		numberPlayers = 0;
		menuMusic.fadeOut(2000);
		var mode = new Creative(this.game);
		this.game.state.start("PreloadGame", true, false, mode);
	},

	backPressed: function () {
		this.game.state.start("Menu");
	},

/*	setPositions: function () {
		var xo = -((this.game.input.mousePointer.x/window.innerWidth)*w2*2 - w2)*0.2;

		var ui = this.ui;
  	ui.title.position.set(w2,h2*0.3);

  	var wOrientation = Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";

		if (wOrientation == "portrait" && mobile) {
  			//ui.title.text ="single\nplayer";
  			ui.title.scale.set(0.7,0.7);
	  	} else {
	  		//ui.title.text ="single player";
	  		ui.title.scale.set(1,1);
	  	}

		if (this.bestScore != 0) {
	    ui.scoreLabel.position.set(w2-270,h2);
	    ui.scoreText.position.set(w2-315,h2+10);
    }

		if (this.bestSurvScore != 0) {
	    ui.endlessLabel.position.set(w2+270,h2);
	    ui.endlessText.position.set(w2+330,h2+10);
	  }


		ui.backButton.position.set(w2/2,h2*1.6);

  },

  update: function() {
    this.setPositions();
  }*/

};
