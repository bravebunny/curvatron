var multiplayer = function (game) {
	this.title = null;
	this.maxPlayers = 7;
	this.nPlayers = 1;
	this.selection = 1;
	this.playersButton = null;
};

multiplayer.prototype = {
	create: function () {

		this.title = this.game.add.text(w2,100, "multiplayer", {
	    font: "150px dosis",
	    fill: "#ffffff",
	    align: "center"});
  	this.title.anchor.setTo(0.5,0.5);

		//menu buttons
		menuArray[0] = new Button(w2, 300, null, '<    ' + (this.nPlayers + 1) + ' players    >', 0, this.right, this, this.game);
		menuArray[0].create();
		this.playersButton = menuArray[0];

		menuArray[1] = new Button(w2, 425, 'accept_button', 'play', 1,  this.play, this, this.game);
		menuArray[1].create();

		menuArray[2] = new Button(w2, 550, 'back_button', 'back', 2,  this.backPressed, this, this.game);
		menuArray[2].create();

		menuArray[this.selection].button.onInputOver.dispatch();

	},

	update: function() {
		menuUpdate();
	},

	play: function () {
		var mode = new MPNormal(this.nPlayers, this.game);
		this.game.state.start("PreloadGame", true, false, mode);
	},

	backPressed:function () {
		this.game.state.start("Menu");
	},

	left: function () {
		if (this.nPlayers == 1) {
			this.nPlayers = this.maxPlayers;
		} else {
			this.nPlayers--;
		}
		this.playersButton.setText('<    ' + (this.nPlayers + 1) + ' players    >');
	},

	right: function () {
		if (this.nPlayers == this.maxPlayers) {
		    this.nPlayers = 1;
	    } else {
			this.nPlayers++;
	    }
	    this.playersButton.setText('<    ' + (this.nPlayers + 1) + ' players    >');
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

};
