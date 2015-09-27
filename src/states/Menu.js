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
  this.selection = 0;
};

menu.prototype = {
  create: function () {
    setScreenFixed(baseH, baseH, this.game);

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

    menuArray = [];

    menuArray[0] = new Button(w2, 300, 'singleplayer_button', 'single player', 0, this.singlePlayer, this, this.game);
    menuArray[0].create();

    menuArray[1] = new Button(w2, 425, 'multiplayer_button', 'multiplayer', 1, this.multiplayer, this, this.game);
    menuArray[1].create();

    menuArray[2] = new Button(w2, 550, 'stats_button', 'statistics', 2, this.stats, this, this.game);
    menuArray[2].create();

    menuArray[3] = new Button(w2, 675, 'editor_button', 'editor', 3, this.editor, this, this.game);
    menuArray[3].create();

    menuArray[4] = new Button(w2, 800, 'settings_button', 'settings', 4, this.settings, this, this.game);
    menuArray[4].create();

    menuArray[5] = new Button(w2, 925, 'exit_button', 'exit', 5, this.backPressed, this, this.game);
    menuArray[5].create();

    selection = this.selection;
    menuArray[selection].select();

	},

  update: function() {
    menuUpdate();
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

  editor: function () {
    /*numberPlayers = 0;
    var mode = new Editor(this.game);
    this.game.state.start("PreloadGame", true, false, mode);*/
    menuMusic.fadeOut(2000);
    this.state.start("Editor2");
  },

	singlePlayer: function () {
		this.state.start("SinglePlayer",true,false);

	},

	settings: function () {
		this.state.start("Settings",true,false);
	},

	multiplayer: function () {
    this.state.start("Multiplayer");
	},

  leaderboard: function () {
    this.state.start("Leaderboards");
  },

  stats: function () {
    this.state.start("Stats");
  },

  up: function() {
    selectUp();
  },

  down: function() {
    selectDown();
  },

  selectPress: function() {
    selectPress();
  },

  selectRelease: function() {
    selectRelease();
  },

  backPressed: function () {
    window.close();
  }

};
