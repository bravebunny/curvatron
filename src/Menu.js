var menu = function(game){
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
  this.scoreLabel = null;
  this.scoreText = null;

}

menu.prototype = {

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
		var text = this.game.add.text(w2,120, "curvatron", {
	        font: "200px Dosis Extrabold",
	        fill: "#ffffff",
	        align: "center"
    	});
    	text.anchor.setTo(0.5,0.5);

    //Single Player
		var spButton = this.game.add.button(w2-150,h2,"singleplayer_button",this.playTheGame,this);
		spButton.anchor.setTo(0.5,0.5);
		spButton.onInputOver.add(this.spOver, this);
		spButton.onInputOut.add(this.spOut, this);

		//Score label that shows on hover
		this.scoreLabel = this.game.add.sprite(w2-265,h2,"sp_score");
		this.scoreLabel.anchor.setTo(0.5,0.5);
		this.scoreLabel.alpha = 0;
		this.scoreText = this.game.add.text(w2-290,h2+10, bestScore, {
        font: "120px Dosis Extrabold",
        fill: colorHex,
        align: "center"
  	});
  	this.scoreText.anchor.setTo(0.5,0.5);
  	this.scoreText.alpha = 0;

    //Multiplayer
		var mpButton = this.game.add.button(w2+150,h2,"multiplayer_button",this.multiplayer,this);
		mpButton.anchor.setTo(0.5,0.5);

  	//SetKeys
  	var keysButton = this.game.add.button(w2-250,h2+230,"setkeys_button",this.setKeys,this);
		keysButton.anchor.setTo(0.5,0.5);

  	//Stats
  	var statsButton = this.game.add.button(w2,h2+230,"stats_button",this.stats,this);
		statsButton.anchor.setTo(0.5,0.5);

  	//Audio
    if(this.game.sound.mute){
    	audioButton = this.game.add.button(w2+250,h2+230,"audiooff_button",this.muteSound,this);
  		audioButton.anchor.setTo(0.5,0.5);
    }
    else{
      audioButton = this.game.add.button(w2+250,h2+230,"audio_button",this.muteSound,this);
      audioButton.anchor.setTo(0.5,0.5);
    }

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
	},

  stats: function() {
    this.game.state.start("Stats");
  },

	spOver: function() {
		this.game.add.tween(this.scoreLabel).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
		this.game.add.tween(this.scoreText).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None, true);

	},

	spOut: function() {
		this.game.add.tween(this.scoreLabel).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
		this.game.add.tween(this.scoreText).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
	},

  muteSound: function(){
    if(this.game.sound.mute){
      audioButton.loadTexture('audio_button');
      this.game.sound.mute = false;
    }
    else{
      audioButton.loadTexture('audiooff_button');
      this.game.sound.mute = true;
    }
  }
}