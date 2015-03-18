var singlePlayer = function (game) {
	this.ui = {};
	this.bestScore = 0;
	this.bestSurvScore = 0;
};
  
singlePlayer.prototype = {
	create: function () {
		var ui = this.ui;

		ui.title = this.game.add.text(0,0, "single player", {
	    font: "150px dosis",
	    fill: "#ffffff",
	    align: "center"});
  	ui.title.anchor.setTo(0.5,0.5);

		//Play Buttons
		ui.normalButton = this.game.add.button(0,0,"collecting_button");
		ui.normalButton.anchor.setTo(0.5,0.5);
		ui.normalButton.input.useHandCursor=true;
		clickButton(ui.normalButton, this.playNormalGame, this);

		ui.endlessButton = this.game.add.button(0,0,"endless_button");
		ui.endlessButton.anchor.setTo(0.5,0.5);
		ui.endlessButton.input.useHandCursor=true;
		clickButton(ui.endlessButton, this.playEndlessGame, this);

		ui.oldSchoolButton = this.game.add.button(0,0,"oldSchool_button");
		ui.oldSchoolButton.anchor.setTo(0.5,0.5);
		ui.oldSchoolButton.input.useHandCursor=true;
		clickButton(ui.oldSchoolButton, this.playOldSchoolGame, this);

		//Go back Button
		ui.backButton = this.game.add.button(0,0,"back_button");
		ui.backButton.anchor.setTo(0.5,0.5);
		ui.backButton.input.useHandCursor=true;
		clickButton(ui.backButton, this.backPressed, this);

		this.setPositions();

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

	setPositions: function () {
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

	  if ((mobile && wOrientation == "landscape") || !mobile) {
			ui.normalButton.position.set(w2-270,h2);
			ui.endlessButton.position.set(w2,h2);
			ui.oldSchoolButton.position.set(w2+270,h2);
		} else if (mobile && wOrientation == "portrait") {
			ui.normalButton.position.set(w2-170,h2-120);
			ui.endlessButton.position.set(w2+170,h2-120);
			ui.oldSchoolButton.position.set(w2,h2+170);
		}

		ui.backButton.position.set(w2/2,h2*1.6);
    }
    
};