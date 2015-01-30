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
  	this.game.stage.backgroundColor = colorHex;
  	w2 = this.game.world.width/2;
		h2 = this.game.world.height/2;

  	this.game.world.scale.set(1);

  	bestScore = localStorage.getItem("highScore");
  	if(bestScore == null) {
  		bestScore = 0;
  	}

		//Game Title
		var text = this.game.add.text(w2,150, "curvatron", {
	        font: "200px Dosis Extrabold",
	        fill: "#ffffff",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

    //Single Player
		var spButton = this.game.add.button(w2-150,h2,"singleplayer_button",this.playTheGame,this);
		spButton.anchor.setTo(0.5,0.5);

    //Multiplayer
		var mpButton = this.game.add.button(w2+150,h2,"multiplayer_button",this.multiplayer,this);
		mpButton.anchor.setTo(0.5,0.5);

  	//SetKeys
  	var keysButton = this.game.add.button(w2-250,h2+230,"setkeys_button",this.setKeys,this);
		keysButton.anchor.setTo(0.5,0.5);

  	//Stats
  	var statsButton = this.game.add.button(w2,h2+230,"stats_button",this.setKeys,this);
		statsButton.anchor.setTo(0.5,0.5);

  	//Audio
  	var audioButton = this.game.add.button(w2+250,h2+230,"audio_button",this.setKeys,this);
		audioButton.anchor.setTo(0.5,0.5);

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