var menu = function(game){
	this.menuSpace = 160;
	maxPlayers = 7;
	  keys = [
    Phaser.Keyboard.W,
    Phaser.Keyboard.P,
    Phaser.Keyboard.B,
    Phaser.Keyboard.Z,
    Phaser.Keyboard.M,
    Phaser.Keyboard.C,
    Phaser.Keyboard.R,
    Phaser.Keyboard.U,]
  numberPlayers = 0;
  bestScore = 0;
  ballsScore = 0;
  deathScore = 0;
  this.scoreLabel = null;
  this.scoreText = null;
  menuMusic = null;

}

menu.prototype = {
  create: function(){
    if (changeColor) {
      chosenColor = this.game.rnd.integerInRange(0, 3);
      colorHex = bgColors[chosenColor];
      colorHexDark = bgColorsDark[chosenColor];
      document.body.style.background = colorHex;
      this.game.stage.backgroundColor = colorHex;
      changeColor = false;
    }

    bgColor = Phaser.Color.hexToColor(colorHex);
  	this.game.stage.backgroundColor = colorHex;
    document.body.style.background = colorHex;
  	w2 = this.game.world.width/2;
		h2 = this.game.world.height/2;

  	this.game.world.scale.set(1);

    if (numberPlayers == 0) {
      if (!menuMusic && !mute) {
        menuMusic = this.game.add.audio('dream');
        menuMusic.loop = true;
        menuMusic.play();
      } else if (!menuMusic.isPlaying && !mute){
        menuMusic.loop = true;
        menuMusic.play();
        menuMusic.volume = 1;
      }
    }

  	bestScore = parseInt(localStorage.getItem("highScore"));
  	if(isNaN(bestScore)) {
  		bestScore = 0;
  	}

    ballsScore = parseInt(localStorage.getItem("ballsScore"));
    if(isNaN(ballsScore)) {
      ballsScore = 0;
    }

    deathScore = parseInt(localStorage.getItem("deathScore"));
    if(isNaN(deathScore)) {
      deathScore = 0;
    }

		//Game Title
		var text = this.game.add.text(w2,120, "curvatron", {
      font: "200px Dosis Extrabold",
      fill: "#ffffff",
      align: "center"
  	});
  	text.anchor.setTo(0.5,0.5);

    var text = this.game.add.text(w2+360,210, "BETA", {
      font: "50px Dosis Extrabold",
      fill: "#ffffff",
      align: "center"
    });
    text.anchor.setTo(0.5,0.5);
    
    var text = this.game.add.text(w2,120, "curvatron", {
      font: "200px Dosis Extrabold",
      fill: "#ffffff",
      align: "center"
    });
    text.anchor.setTo(0.5,0.5);

    //Single Player
		var spButton = this.game.add.button(w2-w2/4,h2,"singleplayer_button",this.playTheGame,this);
		spButton.anchor.setTo(0.5,0.5);
		spButton.onInputOver.add(this.spOver, this);
		spButton.onInputOut.add(this.spOut, this);
    spButton.input.useHandCursor=true;

		//Score label that shows on hove
    if(bestScore != 0){
  		this.scoreLabel = this.game.add.sprite(w2-275,h2,"sp_score");
  		this.scoreLabel.anchor.setTo(0.5,0.5);
  		this.scoreLabel.alpha = 0;
  		this.scoreText = this.game.add.text(w2-300,h2+10, bestScore, {
          font: "120px Dosis Extrabold",
          fill: colorHex,
          align: "center"
    	});
    	this.scoreText.anchor.setTo(0.5,0.5);
    	this.scoreText.alpha = 0;
    }

    //Multiplayer
		var mpButton = this.game.add.button(w2+w2/4,h2,"multiplayer_button",this.multiplayer,this);
		mpButton.anchor.setTo(0.5,0.5);
    if (mobile) {
      mpButton.alpha = 0.2;
    }
    mpButton.input.useHandCursor=true;

    //FullScreen
    /*var fullScreenButton = this.game.add.button(w2+w2/2,h2+230,"fullscreen_button",this.fullScreen,this);
    fullScreenButton.anchor.setTo(0.5,0.5);
    fullScreenButton.input.useHandCursor=true;*/
    //SetKeys
    if(!mobile){
      var keysButton = this.game.add.button(w2+w2/2,h2+230,"setkeys_button",this.setKeys,this);
      keysButton.anchor.setTo(0.5,0.5);
      keysButton.input.useHandCursor=true;
    }

  	//Stats
  	var statsButton = this.game.add.button(w2,h2+230,"stats_button",this.stats,this);
		statsButton.anchor.setTo(0.5,0.5);
    statsButton.input.useHandCursor=true;
    if (mobile) {
      statsButton.x = w2+w2/6;
    }

  	//Audio
    if(mute){
    	audioButton = this.game.add.button(w2/2,h2+230,"audiooff_button",this.muteSound,this);
  		audioButton.anchor.setTo(0.5,0.5);
      audioButton.input.useHandCursor=true;
    }
    else{
      audioButton = this.game.add.button(w2/2,h2+230,"audio_button",this.muteSound,this);
      audioButton.anchor.setTo(0.5,0.5);
      audioButton.input.useHandCursor=true;
    }
    if (mobile) {
      audioButton.x = w2-w2/6;
    }
	},

	playTheGame: function(){
		numberPlayers = 0;
    menuMusic.fadeOut(2000);
		this.game.state.start("PreloadGame",true,false);
	},

	multiplayer: function(){
    if (!mobile) {
      this.game.state.start("Multiplayer");
    }
	},

	setKeys: function() {
    if (!mobile) {
      this.game.state.start("SetKeys");
    }
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
    if(mute){
      audioButton.loadTexture('audio_button');
      //this.game.sound.mute = false;
      mute = false;
      if (!menuMusic) {
        menuMusic = this.game.add.audio('dream');  
      }
      menuMusic.loop = true;
      menuMusic.play();
      menuMusic.volume = 1;
    }
    else{
      audioButton.loadTexture('audiooff_button');
      //this.game.sound.mute = true;
      mute = true;
      if (menuMusic && menuMusic.isPlaying) {
        menuMusic.stop();
      }
    }
  },

  fullScreen: function(){
    if (this.game.scale.isFullScreen){
      this.game.scale.stopFullScreen();
    }
    else{
      this.game.scale.startFullScreen(false);
    }
  },

  backPressed: function() {
    //exit game?
  }
}