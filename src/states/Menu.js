var menu = function (game) {
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
  menuMusic = null;
  this.ui = {};
  this.ui.buttons={};
  graphicsMode = false;
};

menu.prototype = {
  create: function () {

    setScreenFixed(this.game);

    this.world.pivot.set(0, 0);
    this.world.angle = 0;

    if (changeColor) {
      chosenColor = this.game.rnd.integerInRange(0, 3);
      colorHex = bgColors[chosenColor];
      colorHexDark = bgColorsDark[chosenColor];
      document.body.style.background = colorHex;
      this.stage.backgroundColor = colorHex;
      changeColor = false;
    }

    bgColor = Phaser.Color.hexToColor(colorHex);
  	this.stage.backgroundColor = colorHex;
    document.body.style.background = colorHex;

    if (!menuMusic && !mute) {
      menuMusic = this.add.audio('dream');
      menuMusic.loop = true;
      menuMusic.play();
    } else if (!menuMusic.isPlaying && !mute) {
      menuMusic.loop = true;
      menuMusic.play();
      menuMusic.volume = 1;
    }

    var ui = this.ui;

		//Game Title
		ui.title = this.add.text(w2,100, "curvatron", {
      font: "175px dosis",
      fill: "#ffffff",
      align: "center"
  	});
  	ui.title.anchor.setTo(0.5,0.5);

    /*ui.beta = this.add.text(0,0, "BETA", {
      font: "50px dosis",
      fill: "#ffffff",
      align: "center"
    });
    ui.beta.anchor.setTo(0.5,0.5);*/

    //TODO PC leaderboards
    /*ui.leaderboard = this.add.button(0,0,"leaderboard_button");
    ui.leaderboard.anchor.setTo(0.5,0.5);
    ui.leaderboard.input.useHandCursor = true;
    clickButton(ui.leaderboard, this.leaderboard, this);*/

    /*//Configure Keys
    ui.keysButton = this.add.button(0,0,"setkeys_button");
    ui.keysButton.anchor.setTo(0.5,0.5);
    ui.keysButton.input.useHandCursor = true;
    clickButton(ui.keysButton, this.setKeys, this);

  	//Stats
  	ui.statsButton = this.add.button(0,0,"stats_button");
		ui.statsButton.anchor.setTo(0.5,0.5);
    ui.statsButton.input.useHandCursor = true;
    clickButton(ui.statsButton, this.stats, this);

  	//Audio
    if (mute) {
    	ui.audioButton = this.add.button(0,0,"audiooff_button");
  		ui.audioButton.anchor.setTo(0.5,0.5);
      ui.audioButton.input.useHandCursor = true;
    } else {
      ui.audioButton = this.add.button(0,0,"audio_button");
      ui.audioButton.anchor.setTo(0.5,0.5);
      ui.audioButton.input.useHandCursor = true;
    }

    clickButton(ui.audioButton, this.muteSound, this);*/

    ui.buttons.sp = new Button(w2, 300, 'singleplayer_button', 'single player', this.singlePlayer, this, this.game);
    ui.buttons.sp.create();

    ui.buttons.mp = new Button(w2, 500, 'multiplayer_button', 'multiplayer', this.multiplayer, this, this.game);
    ui.buttons.mp.create();

    ui.buttons.stats = new Button(w2, 700, 'stats_button', 'statistics', this.stats, this, this.game);
    ui.buttons.stats.create();

    ui.buttons.settings = new Button(w2, 900, 'settings_button', 'settings', this.stats, this, this.game);
    ui.buttons.settings.create();


;

    this.scale.refresh();
    //Place the menu buttons and labels on their correct positions
    this.setPositions();

	},

  /*getAvatar: function () {
    var loader = new Phaser.Loader(this.game);
    loader.image('avatar',"http://placekitten.com/g/300/300");
    loader.onLoadComplete.addOnce(function () {
      console.log('avatar');
      var ui = this.ui;
      ui.avatar = this.add.image(0, 0, 'avatar');
      ui.avatar.width = 40;
      ui.avatar.height = 40;
      ui.avatar.anchor.set(0.5);
      ui.loginText.setText("logout");
    }.bind(this));
    loader.start();
  },*/

	singlePlayer: function () {
		this.state.start("SinglePlayer",true,false);

	},

	multiplayer: function () {
    //this.state.start("Multiplayer");
    var mode = new Adventure(this.game);
		this.game.state.start("PreloadGame", true, false, mode);
	},

	setKeys: function () {
    this.state.start("SetKeys");
    graphicsMode = true;
	},

  leaderboard: function () {
    this.state.start("Leaderboards");
  },

  stats: function () {
    this.state.start("Stats");
  },

  muteSound: function () {
    var ui = this.ui;

    if (mute){
      ui.audioButton.loadTexture('audio_button');
      //this.game.sound.mute = false;
      mute = false;
      if (!menuMusic) {
        menuMusic = this.add.audio('dream');
      }
      menuMusic.loop = true;
      menuMusic.play();
      menuMusic.volume = 1;
    } else {
      ui.audioButton.loadTexture('audiooff_button');
      //this.game.sound.mute = true;
      mute = true;
      if (menuMusic && menuMusic.isPlaying) {
        menuMusic.stop();
      }
    }
  },

  backPressed: function () {
    //exit game?
  },

  setPositions: function () {
    var ui = this.ui;

    /*for (var key in ui.buttons) {
       if (ui.buttons.hasOwnProperty(key)) {
          ui.buttons[key].reposition();
       }
    }*/
  /*  ui.keysButton.position.set(w2+w2/2,1.6*h2);
    ui.statsButton.position.set(w2,1.6*h2);
    ui.audioButton.position.set(w2/2,1.6*h2)*/

    //TODO leaderboard position
    //ui.leaderboard.position.set(w2+w2/2,1.6*h2)

  }

};
