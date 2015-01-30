var gameTitle = function(game){
	this.menuSpace = 160;
	maxPlayers = 7;
	  keys = [
    Phaser.Keyboard.Q,
    Phaser.Keyboard.Z,
    Phaser.Keyboard.R,
    Phaser.Keyboard.C,
    Phaser.Keyboard.U,
    Phaser.Keyboard.B,
    Phaser.Keyboard.P,
    Phaser.Keyboard.M,]
  numberPlayers = 0;
  bestScore = 0;

}

gameTitle.prototype = {

  create: function(){
  	w2 = this.game.world.width/2;
		h2 = this.game.world.height/2;

  	this.game.world.scale.set(1);

  	bestScore = localStorage.getItem("highScore");
  	if(bestScore == null) {
  		bestScore = 0;
  	}

		var gameTitle = this.game.add.sprite(w2,-160+h2,"gametitle");
		gameTitle.anchor.setTo(0.5,0.5);
		text = this.game.add.text(w2,-160+h2, "CurvaTorn", {
	        font: "40px BAUHS93",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

		var playButton = this.game.add.button(w2,h2,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(w2,h2, "Single Player: " + bestScore, {
	        font: "40px BAUHS93",
	        fill: "#ff0044",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

    //Multiplayer
		var playButton = this.game.add.button(w2,160+h2,"play",this.multiplayer,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(w2,160+h2, "Multiplayer", {
      font: "40px BAUHS93",
      fill: "#ff0044",
      align: "center"
  	});
  	text.anchor.setTo(0.5,0.5);

  	//SetKeys
  	var playButton = this.game.add.button(w2,320+h2,"play",this.setKeys,this);
		playButton.anchor.setTo(0.5,0.5);
		text = this.game.add.text(w2,320+h2, "Set Keys", {
      font: "40px BAUHS93",
      fill: "#ff0044",
      align: "center"
  	});
  	text.anchor.setTo(0.5,0.5);

  	//this.game.state.start("GameTitle");
	},

	playTheGame: function(){
		numberPlayers = 0;
		this.game.state.start("PreloadGame",true,false);
	},

	multiplayer: function(){
		this.game.state.start("Multiplayer");
	},

	setKeys: function() {
		this.game.state.start("SetKeys");
	}
}