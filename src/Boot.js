var boot = function(game){};
  
boot.prototype = {
	preload: function(){
			bgColors = ['#76b83d', '#cf5e4f', '#805296', '#4c99b9'];
			bgColorsDark = ['#213311', '#331713', '#2c1c33', '#152a33'];
	    chosenColor = this.game.rnd.integerInRange(0, 3);

     	this.game.load.image("loading","assets/Load.png");
      this.game.renderer.roundPixels = false;

	    this.game.stage.smoothed = true;

	    colorHex = bgColors[chosenColor];
	    document.body.style.background = colorHex;
	    this.game.stage.backgroundColor = colorHex;
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