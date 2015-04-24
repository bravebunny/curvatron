var multiplayer = function (game) {
	this.ui = {};
	this.maxPlayers = 7;
	this.nPlayers = 1;
};
  
multiplayer.prototype = {
	create: function () {
  	var ui = this.ui;

		ui.title = this.game.add.text(0,0, "multiplayer", {
	    font: "150px dosis",
	    fill: "#ffffff",
	    align: "center"});
  	ui.title.anchor.setTo(0.5,0.5);

    //Number of players
		ui.playersAuxButton = this.game.add.sprite(0,0,"number_players");
		ui.playersAuxButton.anchor.setTo(0.5,0.5);

		ui.textPlayers = this.game.add.text(0,0, (this.nPlayers+1), {
	    font: "120px dosis",
	    fill: colorHex,
	    align: "center"});
    ui.textPlayers.anchor.setTo(0.5,0.5);

    ui.leftArrow = this.game.add.button(0,0,"set_players",this.DecNumberOfPlayers,this);
		ui.leftArrow.anchor.setTo(0.5,0.5);
		ui.leftArrow.alpha = 0.7;
		ui.leftArrow.scale.x = -1;
		ui.leftArrow.input.useHandCursor = true;

		ui.rightArrow = this.game.add.button(0,0,"set_players",this.IncNumberOfPlayers,this);
		ui.rightArrow.anchor.setTo(0.5,0.5);
		ui.rightArrow.alpha = 0.7;
		ui.rightArrow.input.useHandCursor = true;

		//Play Button
		ui.playButton = this.game.add.button(0,0,"resume_button");
		ui.playButton.anchor.setTo(0.5,0.5);
		ui.playButton.input.useHandCursor = true;
		clickButton(ui.playButton, this.playTheGame, this);


	   	//Go back Button
		ui.backButton = this.game.add.button(0,0,"back_button");
		ui.backButton.anchor.setTo(0.5,0.5);
		ui.backButton.input.useHandCursor = true;
		clickButton(ui.backButton, this.backPressed, this);

		//Place the menu buttons and labels on their correct positions
    	this.setPositions();

		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.backPressed, this);
	},

	playTheGame: function () {
		var mode = new MPNormal(this.nPlayers, this.game);
		this.game.state.start("PreloadGame", true, false, mode);
	},

	backPressed:function () {
		this.game.state.start("Menu");
	},

	DecNumberOfPlayers: function () {
		if (this.nPlayers == 1) {
			this.nPlayers = this.maxPlayers;
		} else {
			this.nPlayers--;
		}
		this.ui.textPlayers.setText("" + (this.nPlayers+1));
	},

	IncNumberOfPlayers: function () {
		if (this.nPlayers == this.maxPlayers) {
		    this.nPlayers = 1;
	    } else {
			this.nPlayers++;
	    }
	    this.ui.textPlayers.setText("" + (this.nPlayers+1));
	},

	setPositions: function () {
		var ui = this.ui;

	  	ui.title.position.set(w2,h2*0.3);
	  	ui.playersAuxButton.position.set(w2,h2);
	  	ui.textPlayers.position.set(w2+100,h2+10);
		ui.leftArrow.position.set(w2-150,h2);
		ui.rightArrow.position.set(w2+150,h2);
		ui.playButton.position.set(w2+w2/2,h2*1.6);
		ui.backButton.position.set(w2/2,h2*1.6);
	}
	
};