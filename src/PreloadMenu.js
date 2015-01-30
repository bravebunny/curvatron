var preloadMenu = function(game){}

preloadMenu.prototype = {
	preload: function(){ 
		text = this.game.add.text(0,0, "", {font: "40px Dosis Extrabold",});

    var loadingBar = this.add.sprite(w2,h2,"loading");
    loadingBar.anchor.setTo(0.5,0.5);
    this.load.setPreloadSprite(loadingBar);

    //Load all stuf from menu
		this.game.load.image("audio_button","assets/sprites/menu/audio.png");
		this.game.load.image("audiooff_button","assets/sprites/menu/audiooff.png");
		this.game.load.image("multiplayer_button","assets/sprites/menu/multiplayer.png");
		this.game.load.image("setkeys_button","assets/sprites/menu/setkeys.png");
		this.game.load.image("singleplayer_button","assets/sprites/menu/singleplayer.png");
		this.game.load.image("stats_button","assets/sprites/menu/stats.png");
		this.game.load.image("sp_score","assets/sprites/menu/score.png");

	},
  	create: function(){
			this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
				this.game.state.start("Menu");
			}, this);
	}
}