var multiplayer = function(game){
};
  
multiplayer.prototype = {
  	create: function(){

  	if (numberPlayers == 0) {
  		numberPlayers = 1;
  	}

    	//Number of players
		var playersAuxButton = this.game.add.sprite(w2,h2,"auxBar");
		playersAuxButton.anchor.setTo(0.5,0.5);
		textPlayers = this.game.add.text(w2,h2, (numberPlayers+1) + " players", {
	        font: "40px Arial",
	        fill: "#363636",
	        align: "center"
    	});
    	textPlayers.anchor.setTo(0.5,0.5);

    	var leftArrow = this.game.add.button(w2-112,h2,"arrow",this.DecNumberOfPlayers,this);
		leftArrow.anchor.setTo(0.5,0.5);

		var rightArrow = this.game.add.button(w2+112,h2,"arrow",this.IncNumberOfPlayers,this);
		rightArrow.anchor.setTo(0.5,0.5);

		//Play Button
		var playButton = this.game.add.button(w2,160+h2,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(w2,160+h2, "PLAY", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

    	//Go back Button
		var backButton = this.game.add.button(w2-480,320+h2,"play",this.back,this);
		backButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(w2-480,320+h2, "Back", {
	        font: "40px Arial",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);
	},

	update: function(){
		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function(){this.game.state.start("Menu");}, this);
	},

	playTheGame: function(){
		this.game.state.start("PreloadGame",true,false,numberPlayers);
	},

	back:function(){
		this.game.state.start("Menu");
	},

	DecNumberOfPlayers: function(){
		if(numberPlayers==1){
			numberPlayers=maxPlayers;
		}
		else{
			numberPlayers--;
		}
		textPlayers.setText("" + (numberPlayers+1) + " players");
	},

	IncNumberOfPlayers: function(){
		if(numberPlayers==maxPlayers){
		    numberPlayers=1;
	    }
	    else{
			numberPlayers++;
	    }
	    textPlayers.setText("" + (numberPlayers+1) + " players");
	},
}