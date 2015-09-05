var singlePlayer = function (game) {
	this.ui = {};
	this.bestScore = 0;
	this.bestSurvScore = 0;
	this.selection = 0;
	this.game = game;
};

singlePlayer.prototype = {
	create: function () {
		selection = this.selection;
		var ui = this.ui;

		ui.title = this.game.add.text(w2,100, "single player", {
      font: "150px dosis",
      fill: "#ffffff",
      align: "center"
  	});
  	ui.title.anchor.setTo(0.5,0.5);

		menuArray = [];

		menuArray[0] = new Button(w2, 300, 'collecting_button', 'normal', 0, this.playNormalGame, this, this.game);
		menuArray[0].create();

		menuArray[1] = new Button(w2, 425, 'endless_button', 'endless', 1,  this.playEndlessGame, this, this.game);
		menuArray[1].create();

		menuArray[2] = new Button(w2, 550, 'oldSchool_button', 'old school', 2,  this.playOldSchoolGame, this, this.game);
		menuArray[2].create();

		menuArray[3] = new Button(w2, 675, 'adventure_button', 'adventure', 3,  this.adventure, this, this.game);
		menuArray[3].create();

		menuArray[4] = new Button(w2, 800, 'creative_button', 'creative', 4,  this.creative, this, this.game);
		menuArray[4].create();

		menuArray[5] = new Button(w2, 925, 'back_button', 'back', 5,  this.backPressed, this, this.game);
		menuArray[5].create();

		menuArray[selection].button.onInputOver.dispatch();
	},

	update: function() {
		menuUpdate();
	},

	up: function() {
		selectUp();
	},

	down: function() {
		selectDown();
	},

	selectPress: function() {
		selectPress();
	},

	selectRelease: function() {
		selectRelease();
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
