var singlePlayer = function (game) {
	this.ui = {};
	this.ui.buttons = {};
	this.bestScore = 0;
	this.bestSurvScore = 0;
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

		ui.buttons.normal = new Button(w2, 300, 'collecting_button', 'normal', this.playNormalGame, this, this.game);
		ui.buttons.normal.create();

		ui.buttons.endless = new Button(w2, 500, 'endless_button', 'endless', this.playEndlessGame, this, this.game);
		ui.buttons.endless.create();

		ui.buttons.oldSchool = new Button(w2, 700, 'oldSchool_button', 'old school', this.playOldSchoolGame, this, this.game);
		ui.buttons.oldSchool.create();

		//Go back Button
		ui.backButton = this.game.add.button(0,0,"back_button");
		ui.backButton.anchor.setTo(0.5,0.5);
		ui.backButton.input.useHandCursor=true;
		clickButton(ui.backButton, this.backPressed, this);

		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.backPressed, this);
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
