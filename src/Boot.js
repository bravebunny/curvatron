var boot = function(game){};
  
boot.prototype = {
	preload: function(){
        this.game.load.image("loading","assets/Load.png");
        this.game.renderer.roundPixels = false;

	    this.game.stage.smoothed = true;
	},
  	create: function(){
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    this.game.scale.pageAlignHorizontally = true;
	    this.game.scale.refresh();

	    this.game.physics.startSystem(Phaser.Physics.ARCADE);
	    this.game.physics.arcade.gravity.y = 1000;
		this.game.state.start("PreloadMenu");
	}
}