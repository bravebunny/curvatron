//wf and hx are fractions of the width and hight of the screen, respectively
//if wf = 0.5 and hf = 0.5, the button will stay in the center of the screen.
//xo and yo are the x and y offsets
var Button = function (x, y, iconName, text, callback, buttonArray, context, game) {
	this.x = x;
	this.y = y;
	this.text = text;
	this.iconName = iconName;
	this.callback = callback;
	this.context = context;
	this.game = game;
	this.buttonArray = buttonArray;

  this.graphics = null;
	this.label = null;
	this.icon = null;
	this.button = null;

	this.w = 520;
	this.h = 130;
	this.selected = false;
};

Button.prototype = {
	create: function () {
		var x = this.x;
		var y = this.y;
		var w = this.w;
		var h = this.h;

		//Button background rectangle
    this.graphics = this.game.add.graphics(-w/2, -h/2);
    this.graphics.lineStyle(0);
    this.graphics.beginFill(0xFFFFFF, 1);
    this.graphics.drawRoundedRect(0, 0, w, h, h/2);
    this.graphics.endFill();
		//this.graphics.anchor.setTo(0.5,0.5);

		//Button label
		this.label = this.game.add.text(50, 0, this.text, {
			font: "60px dosis",
			fill: colorHex
		});
		this.label.anchor.setTo(0.5,0.5);

		//Button icon
		this.icon = this.game.add.sprite(-w/2 + 80, 0, this.iconName);
		this.icon.scale.set(0.7, 0.7);
		this.icon.tint = parseInt(colorHex.substring(1), 16);
		//this.icon.hitArea = new Phaser.Rectangle(-80, -80, w, h);
		this.icon.anchor.setTo(0.5,0.5);


		//Button group
		this.button = this.game.add.button(x, y);
		//this.icon.hitArea = new Phaser.Rectangle(-80, -80, w, h);
		this.button.input.useHandCursor = true;

		clickButton(this.button, this.callback, this.context, this.buttonArray);
		this.button.addChild(this.graphics);
		this.button.addChild(this.icon);
		this.button.addChild(this.label);
		this.button.anchor.setTo(0.5,0.5);
	}

};
