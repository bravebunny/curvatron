var Editor = function(game) {
	this.sp = true;
	this.game = game;
	this.layer = null;
	this.marker = null;
	this.map = null;

	this.maxPoints = 10;

	this.tool = 0; //0=draw, 1=erase, 2=point
	this.selectedPoint = 1;

	this.tb = {};
};

Editor.prototype = {

	preload: function () {
		setScreenFixed(baseW, baseH+200, this.game);

		this.game.load.image('point', 'assets/sprites/game/singleplayer/point.png');
		this.game.load.image('player0', 'assets/sprites/game/singleplayer/player.png');
		this.game.load.image('superPower', 'assets/sprites/game/singleplayer/powerHS.png');
		this.game.load.image('obstacle', 'assets/sprites/game/singleplayer/obstacle.png');
		this.game.load.spritesheet('shrink', 'assets/sprites/game/singleplayer/shrink.png', 100, 100);

		this.game.load.image('editorPoint', 'assets/sprites/gui/editor/point.png');
		this.game.load.image('editorDraw', 'assets/sprites/gui/editor/draw.png');
		this.game.load.image('editorErase', 'assets/sprites/gui/editor/erase.png');
		this.game.load.image('editorArrow', 'assets/sprites/gui/editor/arrow.png');
		this.game.load.image('editorStart', 'assets/sprites/gui/editor/start.png');
		this.game.load.image('editorSave', 'assets/sprites/gui/editor/save.png');

		this.game.load.image('Pastel', 'assets/levels/Pastel.png'); // loading the tileset image
		this.game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON); // loading the tilemap file
		this.game.load.json('points1', 'assets/levels/points1.json');


	},

	create: function() {
		this.obstacleGroup = this.game.add.group();
		this.lastPoint = null;
		this.player = players[0];

		this.marker = this.game.add.graphics();
    this.marker.lineStyle(2, 0xFFFFFF, 1);
    this.marker.drawRect(0, 0, 24, 24);
		this.marker.lineStyle(2, 0x000000, 1);
		this.marker.drawRect(0, 0, 22, 22);

		this.map = this.game.add.tilemap('level1'); // Preloaded tilemap
		this.map.addTilesetImage('Pastel'); // Preloaded tileset

		this.layer = this.map.createLayer('obstacles'); //layer[0]
		this.map.setCollisionByExclusion([], true, this.layer);
		this.tile = this.map.getTile(0, 0);

		this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

		//toolbar background
		this.tb.bg = this.game.add.sprite(0, baseH, 'overlay');
		this.tb.bg.width = baseW;
		this.tb.bg.height = 200;
		this.tb.bg.alpha = 0.5;

		//toolbar icons
		this.tb.left = this.game.add.button(200, baseH+100, 'editorArrow', this.pointDec, this);
		this.tb.left.anchor.setTo(0.5, 0.5);
		this.tb.left.scale.set(-0.5, 0.5);

		this.tb.point = this.game.add.button(300, baseH+100, 'editorPoint', this.pointTool, this);
		this.tb.point.anchor.setTo(0.5, 0.5);
		this.tb.point.scale.set(0.5);

		//toolbar icons
		this.tb.right = this.game.add.button(400, baseH+100, 'editorArrow', this.pointInc, this);
		this.tb.right.anchor.setTo(0.5, 0.5);
		this.tb.right.scale.set(0.5);

		this.tb.draw = this.game.add.button(700, baseH+100, 'editorDraw', this.drawTool, this);
		this.tb.draw.anchor.setTo(0.5, 0.5);
		this.tb.draw.scale.set(0.5);

		this.tb.erase = this.game.add.button(1000, baseH+100, 'editorErase', this.eraseTool, this);
		this.tb.erase.anchor.setTo(0.5, 0.5);
		this.tb.erase.scale.set(0.5);

		this.tb.erase = this.game.add.button(1300, baseH+100, 'editorStart', this.startTool, this);
		this.tb.erase.anchor.setTo(0.5, 0.5);
		this.tb.erase.scale.set(0.8);

		this.tb.erase = this.game.add.button(1600, baseH+100, 'editorSave', this.save, this);
		this.tb.erase.anchor.setTo(0.5, 0.5);
		this.tb.erase.scale.set(0.5);
	},

	update: function() {
		this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * 24;
    this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * 24;

		if (this.game.input.mousePointer.isDown) {
			console.log(this.tool)
			switch(this.tool) {
				case 0: //draw
					if (this.map.getTile(this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y)) != this.tile) {
							this.map.putTile(this.tile, this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y))
					}
				break;

				case 1: //erase
					if (this.map.getTile(this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y)) != this.tile) {
							this.map.removeTile(this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y))
					}
				break;

				case 2: //point
				break;
			}

    }

		/*if(this.game.physics.arcade.collide(players[0].sprite, this.layer)){
			players[0].kill();
		}*/
	},

	drawTool: function() {
		this.tool = 0;
	},

	eraseTool: function() {
		this.tool = 1;
		console.log(this.tool)
	},

	pointTool: function() {
		this.tool = 2;
	},

	pointDec: function() {
		//this.tool = 'point';
	},

	pointInc: function() {
		//this.tool = 'point';
	},

	erasesTrail: function() {
		return true;
	},

	pause: function() {

	},

	unPause: function() {

	}

};
