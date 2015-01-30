var boot = function(game){};
  
boot.prototype = {
	preload: function(){
			bgColors = ['#76b83d', '#47a2b3', '#ca555a', '#d96d53'];

     	this.game.load.image("loading","assets/Load.png");
      this.game.renderer.roundPixels = false;

	    this.game.stage.smoothed = true;
	    this.game.stage.backgroundColor = bgColors[this.game.rnd.integerInRange(0, 3)];
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