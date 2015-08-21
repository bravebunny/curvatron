var preloadMenu = function (game) {};

preloadMenu.prototype = {
	preload: function () {

		var loadingBar = this.add.sprite(w2,h2,"loading");
		this.game.physics.enable(loadingBar, Phaser.Physics.ARCADE);
		loadingBar.anchor.setTo(0.5,0.5);
		loadingBar.body.angularVelocity = 200;
		this.game.physics.arcade.velocityFromAngle(loadingBar.angle, 300*this.speed, loadingBar.body.velocity);
		//Load all stuf from menu
		this.game.load.image("stats_button","assets/sprites/menu/main/stats.png");
		this.game.load.image("multiplayer_button","assets/sprites/menu/main/multiplayer.png");
		this.game.load.image("singleplayer_button","assets/sprites/menu/main/singleplayer.png");
		this.game.load.image("settings_button","assets/sprites/menu/main/settings.png");

		this.game.load.image("endless_button","assets/sprites/menu/singleplayer/endless.png");
		this.game.load.image("oldSchool_button","assets/sprites/menu/singleplayer/oldSchool.png");
		this.game.load.image("collecting_button","assets/sprites/menu/singleplayer/collecting.png");
		this.game.load.image("adventure_button","assets/sprites/menu/singleplayer/adventure.png");
		this.game.load.image("creative_button","assets/sprites/menu/singleplayer/creative.png");

		this.game.load.image("audio_button","assets/sprites/menu/settings/audio.png");
		this.game.load.image("audiooff_button","assets/sprites/menu/settings/audiooff.png");
		this.game.load.image("setkeys_button","assets/sprites/menu/settings/setkeys.png");
		this.game.load.image("leaderboard_button","assets/sprites/menu/settings/leaderboard.png");
		this.game.load.image("fullscreen_button","assets/sprites/menu/settings/fullscreen.png");
		this.game.load.image("player_select","assets/sprites/menu/settings/playerSelect.png");
		this.game.load.image("key_button","assets/sprites/menu/settings/key.png");



		this.game.load.image("back_button","assets/sprites/menu/navigation/back.png");
		this.game.load.image("accept_button","assets/sprites/menu/navigation/accept.png");
		this.game.load.image("exit_button","assets/sprites/menu/navigation/exit.png");

		this.game.load.image("deaths-stats","assets/sprites/menu/stats/deaths-stats.png");
		this.game.load.image("old-stats","assets/sprites/menu/stats/old-stats.png");
		this.game.load.image("score-stat","assets/sprites/menu/stats/score-stat.png");
		this.game.load.image("total-stats","assets/sprites/menu/stats/total-stats.png");
		this.game.load.image("aux-stat","assets/sprites/menu/stats/aux-stat.png");
		this.game.load.image("survScore-stat","assets/sprites/menu/stats/endless-stat.png");

		this.game.load.image("number_players","assets/sprites/menu/numberPlayers.png");
		this.game.load.image("number_mod","assets/sprites/menu/numberMod.png");
		this.game.load.image("set_players","assets/sprites/menu/setPlayers.png");
		this.game.load.image("resume_button","assets/sprites/menu/resume.png");


		this.game.load.audio('dream', 'assets/music/dream.ogg');

	},

	create: function () {
		//TODO stupid 1 second
		this.game.time.events.add(Phaser.Timer.SECOND * 1, function () {
			this.game.state.start("Menu");
		}, this);
	}

};
