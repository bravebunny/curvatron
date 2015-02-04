var multiplayer = function(game){
};
  
multiplayer.prototype = {
	create: function(){
  	if (numberPlayers == 0) {
  		numberPlayers = 1;
  	}

		var text = this.game.add.text(w2,120, "multiplayer", {
	    font: "150px Dosis Extrabold",
	    fill: "#ffffff",
	    align: "center"});
	  	text.anchor.setTo(0.5,0.5);

	    //Number of players
		var playersAuxButton = this.game.add.sprite(w2,h2,"number_players");
		playersAuxButton.anchor.setTo(0.5,0.5);

		textPlayers = this.game.add.text(w2+100,h2+10, (numberPlayers+1), {
	    font: "120px Dosis Extrabold",
	    fill: colorHex,
	    align: "center"});
	    textPlayers.anchor.setTo(0.5,0.5);

	    var leftArrow = this.game.add.button(w2-150,h2,"set_players",this.DecNumberOfPlayers,this);
		leftArrow.anchor.setTo(0.5,0.5);
		leftArrow.alpha = 0.7;
		leftArrow.scale.x = -1;
		leftArrow.input.useHandCursor=true;

		var rightArrow = this.game.add.button(w2+150,h2,"set_players",this.IncNumberOfPlayers,this);
		rightArrow.anchor.setTo(0.5,0.5);
		rightArrow.alpha = 0.7;
		rightArrow.input.useHandCursor=true;

		//Play Button
		var playButton = this.game.add.button(w2+w2/2,h2+230,"resume_button",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		playButton.input.useHandCursor=true;


	   //Go back Button
		var backButton = this.game.add.button(w2/2,h2+230,"back_button",this.backPressed,this);
		backButton.anchor.setTo(0.5,0.5);
		backButton.input.useHandCursor=true;
		this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.backPressed, this);
	},

	playTheGame: function(){
		this.game.state.start("PreloadGame",true,false,numberPlayers);
	},

	backPressed:function(){
		this.game.state.start("Menu");
	},

	DecNumberOfPlayers: function(){
		if(numberPlayers==1){
			numberPlayers=maxPlayers;
		}
		else{
			numberPlayers--;
		}
		textPlayers.setText("" + (numberPlayers+1));
	},

	IncNumberOfPlayers: function(){
		if(numberPlayers==maxPlayers){
		    numberPlayers=1;
	    }
	    else{
			numberPlayers++;
	    }
	    textPlayers.setText("" + (numberPlayers+1));
	},
}