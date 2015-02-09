var setKeys = function(game){
	this.selectedPlayer = 0;
	this.keyText = null;
};
  
setKeys.prototype = {
  create: function(){
		var text = this.game.add.text(w2,120, "configure keys", {
        font: "150px dosis",
        fill: "#ffffff",
        align: "center"
  	});
  	text.anchor.setTo(0.5,0.5);


  	//select player
		var playersAuxButton = this.game.add.sprite(w2,h2-80,"player_select");
		playersAuxButton.anchor.setTo(0.5,0.5);
		textPlayers = this.game.add.text(w2,h2-20, (this.selectedPlayer+1), {
	        font: "100px dosis",
	        fill: "#ffffff",
	        align: "center"
  	});
  	textPlayers.anchor.setTo(0.5,0.5);

    var leftArrow = this.game.add.button(w2-90,h2-80,"set_players",this.DecSelected,this);
		leftArrow.anchor.setTo(0.5,0.5);
		leftArrow.scale.x = -1;
		leftArrow.alpha = .7;
		leftArrow.input.useHandCursor=true;

		var rightArrow = this.game.add.button(w2+90,h2-80,"set_players",this.IncSelected,this);
		rightArrow.anchor.setTo(0.5,0.5);
		rightArrow.alpha = .7;
		rightArrow.input.useHandCursor=true;

  	//key select button
		var keyButton = this.game.add.sprite(w2,160+h2,"key_button");
		keyButton.anchor.setTo(0.5,0.5);
		this.keyText = this.game.add.text(w2,h2+140, String.fromCharCode(keys[this.selectedPlayer]), {
      font: "150px dosis",
      fill: colorHex,
      align: "center"
  	});
  	this.keyText.anchor.setTo(0.5,0.5);

		//Play Button
		var playButton = this.game.add.button(w2/2,h2+230,"accept_button",this.backPressed,this);
		playButton.anchor.setTo(0.5,0.5);
		playButton.input.useHandCursor=true;

    //Go back Button
		/*var backButton = this.game.add.button(w2/2,h2+230,"back_button",this.back,this);
		backButton.anchor.setTo(0.5,0.5);
		backButton.input.useHandCursor=true;*/

  	this.game.input.keyboard.addCallbacks(this, this.onPressed);
  	this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.backPressed, this);
	},

	backPressed:function(){
		this.game.state.start("Menu");
	},

	DecSelected: function(){
		if(this.selectedPlayer==0){
			this.selectedPlayer=maxPlayers;
		}
		else{
			this.selectedPlayer--;
		}
		textPlayers.setText(this.selectedPlayer+1);
		this.keyText.setText(String.fromCharCode(keys[this.selectedPlayer]));
	},

	IncSelected: function(){
		if(this.selectedPlayer==maxPlayers){
		    this.selectedPlayer=0;
	    }
	    else{
				this.selectedPlayer++;
	    }
    textPlayers.setText(this.selectedPlayer+1);
    this.keyText.setText(String.fromCharCode(keys[this.selectedPlayer]));

	},

	onPressed: function(){
		if (this.game.input.keyboard.lastKey.keyCode >= 48 && this.game.input.keyboard.lastKey.keyCode <= 90) {
			keys[this.selectedPlayer] = this.game.input.keyboard.lastKey.keyCode;
			this.keyText.setText(String.fromCharCode(keys[this.selectedPlayer]));
		}

	},

  resize: function() {
  	this.game.state.restart(true,false);
  }
}