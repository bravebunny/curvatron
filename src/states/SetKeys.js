var setKeys = function (game) {
	this.ui = {};
	this.selectedPlayer = 0;
};
  
setKeys.prototype = {
	create: function () {

  		var ui = this.ui;

		ui.title = this.game.add.text(0,0, "configure keys", {
	        font: "150px dosis",
	        fill: "#ffffff",
	        align: "center"
	  	});
	  	ui.title.anchor.setTo(0.5,0.5);

  		//select player
		ui.playersAuxButton = this.game.add.sprite(0,0,"player_select");
		ui.playersAuxButton.anchor.setTo(0.5,0.5);

		ui.textPlayers = this.game.add.text(0,0, (this.selectedPlayer+1), {
	        font: "100px dosis",
	        fill: "#ffffff",
	        align: "center"
		});
	  	ui.textPlayers.anchor.setTo(0.5,0.5);

    	ui.leftArrow = this.game.add.button(0,0,"set_players",this.DecSelected,this);
		ui.leftArrow.anchor.setTo(0.5,0.5);
		ui.leftArrow.scale.x = -1;
		ui.leftArrow.alpha = .7;
		ui.leftArrow.input.useHandCursor=true;

		ui.rightArrow = this.game.add.button(0,0,"set_players",this.IncSelected,this);
		ui.rightArrow.anchor.setTo(0.5,0.5);
		ui.rightArrow.alpha = .7;
		ui.rightArrow.input.useHandCursor=true;

  		//key select button
		ui.keyButton = this.game.add.sprite(0,0,"key_button");
		ui.keyButton.anchor.setTo(0.5,0.5);
		ui.keyText = this.game.add.text(0,0, String.fromCharCode(keys[this.selectedPlayer]), {
      font: "150px dosis",
      fill: colorHex,
      align: "center"
  	});
		ui.keyText.anchor.setTo(0.5,0.5);

		//Play Button
		ui.playButton = this.game.add.button(0,0,"accept_button");
		ui.playButton.anchor.setTo(0.5,0.5);
		ui.playButton.input.useHandCursor=true;
		clickButton(ui.playButton, this.backPressed, this);

		//Place the menu buttons and labels on their correct positions
  	this.setPositions();

  	this.game.input.keyboard.addCallbacks(this, this.onPressed);
  	this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.backPressed, this);
	},

	backPressed: function () {
		this.game.state.start("Menu");
	},

	DecSelected: function() {
		if (this.selectedPlayer == 0) {
			this.selectedPlayer = maxPlayers;
		} else {
			this.selectedPlayer--;
		}
		this.ui.textPlayers.setText(this.selectedPlayer+1);
		this.ui.keyText.setText(String.fromCharCode(keys[this.selectedPlayer]));
	},

	IncSelected: function () {
		if (this.selectedPlayer == maxPlayers) {
		    this.selectedPlayer = 0;
	    } else {
			this.selectedPlayer++;
	    }
	    this.ui.textPlayers.setText(this.selectedPlayer+1);
	    this.ui.keyText.setText(String.fromCharCode(keys[this.selectedPlayer]));
	},

	onPressed: function () {
		if (this.game.input.keyboard.lastKey.keyCode >= 48 && this.game.input.keyboard.lastKey.keyCode <= 90 && this.state.current == "SetKeys") {
			keys[this.selectedPlayer] = this.game.input.keyboard.lastKey.keyCode;
			this.ui.keyText.setText(String.fromCharCode(keys[this.selectedPlayer]));
		}
	},

	setPositions: function () {
		var ui = this.ui;

	  ui.title.position.set(w2,h2*0.3);
    var wOrientation = Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
    if (wOrientation == "portrait" && mobile) {
      ui.title.scale.set(0.7,0.7);
    } else {
      ui.title.scale.set(1,1);
    }

		ui.playersAuxButton.position.set(w2,h2-80);
		ui.textPlayers.position.set(w2,h2-20);
		ui.leftArrow.position.set(w2-90,h2-80);
		ui.rightArrow.position.set(w2+90,h2-80);
		ui.keyButton.position.set(w2,160+h2);
		ui.keyText.position.set(w2,h2+140);
		ui.playButton.position.set(w2/2,1.6*h2);
	}
	
};