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

	    w2 = this.game.world.width/2;
			h2 = this.game.world.height/2;

		this.game.state.start("PreloadMenu");
	}
}