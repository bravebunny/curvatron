//wf and hx are fractions of the width and hight of the screen, respectively
//if wf = 0.5 and hf = 0.5, the button will stay in the center of the screen.
//xo and yo are the x and y offsets
var Button = function (x, y, iconName, text, callback, context, game) {
	this.x = x;
	this.y = y;
	this.text = text;
	this.iconName = iconName;
	this.callback = callback;
	this.context = context;
	this.game = game;

  this.graphics = null;
	this.label = null;
	this.icon = null;

	this.w = 520;
	this.h = 130;
};

Button.prototype = {
	create: function () {
		var x = this.x;
		var y = this.y;
		var w = this.w;
		var h = this.h;

		//Button background rectangle
    this.graphics = this.game.add.graphics(x-w/2, y-h/2);
    this.graphics.lineStyle(0);
    this.graphics.beginFill(0xFFFFFF, 1);
    this.graphics.drawRoundedRect(0, 0, w, h, h/2);
    this.graphics.endFill();
		//this.graphics.anchor.setTo(0.5,0.5);

		//Button icon
		this.icon = this.game.add.button(x-w/2 + 80, y, this.iconName);
		this.icon.anchor.setTo(0.5,0.5);
		this.icon.scale.set(0.7, 0.7);
		this.icon.tint = parseInt(colorHex.substring(1), 16);
		//this.icon.hitArea = new Phaser.Circle(0, 0,2*this.radius);
		this.icon.input.useHandCursor = true;
		clickButton(this.icon, this.callback, this.context);

		//Button label
		this.label = this.game.add.text(x+50, y, this.text, {
			font: "60px dosis",
			fill: colorHex,
			align: "middle"
		});
		this.label.anchor.setTo(0.5,0.5);
	}

};
