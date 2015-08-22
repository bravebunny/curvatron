var preloadMenu = function (game) {};

preloadMenu.prototype = {
	preload: function () {

		var loadingBar = this.add.sprite(w2,h2,"loading");
		this.game.physics.enable(loadingBar, Phaser.Physics.ARCADE);
		loadingBar.anchor.setTo(0.5,0.5);
		loadingBar.body.angularVelocity = 200;
		this.game.physics.arcade.velocityFromAngle(loadingBar.angle, 300*this.speed, loadingBar.body.velocity);
		//Load all stuf from menu
		this.game.load.image("stats_button","assets/sprites/gui/main/stats.png");
		this.game.load.image("multiplayer_button","assets/sprites/gui/main/multiplayer.png");
		this.game.load.image("singleplayer_button","assets/sprites/gui/main/singleplayer.png");
		this.game.load.image("settings_button","assets/sprites/gui/main/settings.png");

		this.game.load.image("endless_button","assets/sprites/gui/singleplayer/endless.png");
		this.game.load.image("oldSchool_button","assets/sprites/gui/singleplayer/oldSchool.png");
		this.game.load.image("collecting_button","assets/sprites/gui/singleplayer/collecting.png");
		this.game.load.image("adventure_button","assets/sprites/gui/singleplayer/adventure.png");
		this.game.load.image("creative_button","assets/sprites/gui/singleplayer/creative.png");

		this.game.load.image("audio_button","assets/sprites/gui/settings/audio.png");
		this.game.load.image("audiooff_button","assets/sprites/gui/settings/audiooff.png");
		this.game.load.image("setkeys_button","assets/sprites/gui/settings/setkeys.png");
		this.game.load.image("leaderboard_button","assets/sprites/gui/settings/leaderboard.png");
		this.game.load.image("fullscreen_button","assets/sprites/gui/settings/fullscreen.png");
		this.game.load.image("player_select","assets/sprites/gui/settings/playerSelect.png");
		this.game.load.image("key_button","assets/sprites/gui/settings/key.png");

		this.game.load.image("back_button","assets/sprites/gui/navigation/back.png");
		this.game.load.image("accept_button","assets/sprites/gui/navigation/accept.png");
		this.game.load.image("exit_button","assets/sprites/gui/navigation/exit.png");

		this.game.load.image("deaths-stats","assets/sprites/gui/stats/deaths-stats.png");
		this.game.load.image("old-stats","assets/sprites/gui/stats/old-stats.png");
		this.game.load.image("score-stat","assets/sprites/gui/stats/score-stat.png");
		this.game.load.image("total-stats","assets/sprites/gui/stats/total-stats.png");
		this.game.load.image("aux-stat","assets/sprites/gui/stats/aux-stat.png");
		this.game.load.image("survScore-stat","assets/sprites/gui/stats/endless-stat.png");

		this.game.load.image("number_players","assets/sprites/gui/numberPlayers.png");
		this.game.load.image("number_mod","assets/sprites/gui/numberMod.png");
		this.game.load.image("set_players","assets/sprites/gui/setPlayers.png");
		this.game.load.image("resume_button","assets/sprites/gui/resume.png");


		this.game.load.audio('dream', 'assets/music/dream.ogg');

	},

	create: function () {
		//TODO stupid 1 second
		this.game.time.events.add(Phaser.Timer.SECOND * 1, function () {
			this.game.state.start("Menu");
		}, this);
	}

};
