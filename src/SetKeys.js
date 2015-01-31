var setKeys = function(game){
	this.selectedPlayer = 0;
	this.keyText = null;
};
  
setKeys.prototype = {
  create: function(){
		var text = this.game.add.text(w2,120, "configure keys", {
        font: "150px Dosis Extrabold",
        fill: "#ffffff",
        align: "center"
  	});
  	text.anchor.setTo(0.5,0.5);


  	//select player
		var playersAuxButton = this.game.add.sprite(w2,h2,"singleplayer_button");
		playersAuxButton.anchor.setTo(0.5,0.5);
		textPlayers = this.game.add.text(w2,h2, (this.selectedPlayer+1), {
	        font: "40px BAUHS93",
	        fill: "#ffffff",
	        align: "center"
  	});
  	textPlayers.anchor.setTo(0.5,0.5);

    var leftArrow = this.game.add.button(w2-112,h2,"arrow",this.DecSelected,this);
		leftArrow.anchor.setTo(0.5,0.5);

		var rightArrow = this.game.add.button(w2+112,h2,"arrow",this.IncSelected,this);
		rightArrow.anchor.setTo(0.5,0.5);

  	//key select button
		var keyButton = this.game.add.button(w2,160+h2,"key",this.selectKey,this);
		keyButton.anchor.setTo(0.5,0.5);
		this.keyText = this.game.add.text(w2,160+h2, String.fromCharCode(keys[this.selectedPlayer]), {
	        font: "40px BAUHS93",
	        fill: "#ff0044",
	        align: "center"
  	});
  	this.keyText.anchor.setTo(0.5,0.5);

  	//back button
		var backButton = this.game.add.button(w2-480,320+h2,"play",this.back,this);
		backButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(w2-480,320+h2, "Back", {
	        font: "40px BAUHS93",
	        fill: "#ff0044",
	        align: "center"
  	});
  	text.anchor.setTo(0.5,0.5);

  	this.game.input.keyboard.addCallbacks(this, this.onPressed);
	},

	update: function(){
		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(
			function(){
				this.game.state.start("Menu");
			},this);

	},

	back:function(){
		this.game.input.keyboard.onDownCallback = null;
		this.game.state.start("Menu");
		
	},

	DecSelected: function(){
		if(this.selectedPlayer==0){
			this.selectedPlayer=maxPlayers;
		}
		else{
			this.selectedPlayer--;
		}
		textPlayers.setText("Player " + (this.selectedPlayer+1));
		this.keyText.setText(String.fromCharCode(keys[this.selectedPlayer]));
	},

	IncSelected: function(){
		if(this.selectedPlayer==maxPlayers){
		    this.selectedPlayer=0;
	    }
	    else{
				this.selectedPlayer++;
	    }
    textPlayers.setText("Player " + (this.selectedPlayer+1));
    this.keyText.setText(String.fromCharCode(keys[this.selectedPlayer]));

	},

	onPressed: function(){
		console.log("onPressed")
		keys[this.selectedPlayer] = this.game.input.keyboard.lastKey.keyCode;
		this.keyText.setText(String.fromCharCode(keys[this.selectedPlayer]));
	}
}