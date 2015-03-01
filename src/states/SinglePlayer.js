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
		ui.normalButton = this.game.add.button(0,0,"collecting_button",this.playNormalGame,this);
		ui.normalButton.anchor.setTo(0.5,0.5);
		ui.normalButton.input.useHandCursor=true;

		ui.endlessButton = this.game.add.button(0,0,"endless_button",this.playEndlessGame,this);
		ui.endlessButton.anchor.setTo(0.5,0.5);
		ui.endlessButton.input.useHandCursor=true;

		if (mobile){
			ui.oldSchoolButton = this.game.add.button(0,0,"oldSchool_button",this.playOldShcoolGame,this);
			ui.oldSchoolButton.anchor.setTo(0.5,0.5);
			ui.oldSchoolButton.input.useHandCursor=true;
		}

		if (!mobile) {
			//Score label that shows on hove
			this.bestScore = localStorage.getItem("highScore")
			if (this.bestScore != 0) {
				ui.scoreLabel = this.add.sprite(0,0,"sp_score");
				ui.scoreLabel.anchor.setTo(0.5,0.5);
				ui.scoreLabel.alpha = 0;
				ui.scoreText = this.add.text(0,0, this.bestScore, {
			        font: "100px dosis",
			        fill: colorHex,
			        align: "center"});
				ui.scoreText.anchor.setTo(0.5,0.5);
				ui.scoreText.alpha = 0;
				if (!mobile) {
					ui.normalButton.onInputOver.add(this.normalOver, this);
					ui.normalButton.onInputOut.add(this.normalOut, this);
				}
			}

		
			this.bestSurvScore = localStorage.getItem("survivalScore")
	    if (this.bestSurvScore != 0) {
	  		ui.endlessLabel = this.add.sprite(0,0,"sp_score");
	  		ui.endlessLabel.scale.x = -1;
	  		ui.endlessLabel.anchor.setTo(0.5,0.5);
	  		ui.endlessLabel.alpha = 0;
	  		ui.endlessText = this.add.text(0,0, this.bestSurvScore, {
	          font: "60px dosis",
	          fill: colorHex,
	          align: "center"
	    	});
	    	ui.endlessText.anchor.setTo(0.5,0.5);
	    	ui.endlessText.alpha = 0;

		    	ui.endlessButton.onInputOver.add(this.endlessOver, this);
					ui.endlessButton.onInputOut.add(this.endlessOut, this);
			}
    }

		//Go back Button
		ui.backButton = this.game.add.button(0,0,"back_button",this.backPressed,this);
		ui.backButton.anchor.setTo(0.5,0.5);
		ui.backButton.input.useHandCursor=true;

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

	playOldschoolGame: function () {
		numberPlayers = 0;
    menuMusic.fadeOut(2000);
    var mode = new OldSchool(this.game);
		this.game.state.start("PreloadGame", true, false, mode);
	},

	backPressed: function () {
		this.game.state.start("Menu");
	},

	normalOver: function () {
		this.add.tween(this.ui.scoreLabel).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
		this.add.tween(this.ui.scoreText).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
	},

	normalOut: function () {
		this.add.tween(this.ui.scoreLabel).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
		this.add.tween(this.ui.scoreText).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
	},

	endlessOver: function () {
		this.add.tween(this.ui.endlessLabel).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
		this.add.tween(this.ui.endlessText).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
	},

	endlessOut: function () {
		this.add.tween(this.ui.endlessLabel).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
		this.add.tween(this.ui.endlessText).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
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

	  if (mobile && wOrientation == "landscape") {
			ui.normalButton.position.set(w2-270,h2);
			ui.endlessButton.position.set(w2,h2);
			ui.oldSchoolButton.position.set(w2+270,h2);
		} else if (mobile && wOrientation == "portrait") {
			ui.normalButton.position.set(w2-170,h2-64);
			ui.endlessButton.position.set(w2+170,h2-64);
			ui.oldSchoolButton.position.set(w2,h2+170);
		} else {
			ui.normalButton.position.set(w2-170,h2);
			ui.endlessButton.position.set(w2+170,h2);
		}

		ui.backButton.position.set(w2/2,h2*1.6);
    }
    
};