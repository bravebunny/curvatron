/*eslint-disable*/
/* global scale, Phaser, players
*/
/*eslint-enable*/
var Horizontal = function (game, x, y) {
  this.game = game
  this.x = x
  this.y = y

  this.w = 200 * scale
  this.h = 30 * scale
  this.dist = 150 * scale
  this.sprite = null

  this.spriteAxis = null
}

Horizontal.prototype = {
  create: function () {
    var bmd = this.game.add.bitmapData(this.w, this.h)
    bmd.fill(0xFF, 0xFF, 0xFF, 1)
    this.sprite = this.game.add.sprite(this.x - this.dist, this.y, bmd)
    this.sprite.anchor.set(0.5)
    this.game.physics.arcade.enable(this.sprite)

    var bmdAxis = this.game.add.bitmapData(this.w * 2.5, this.h * 0.7)
    bmdAxis.fill(0xFF, 0xFF, 0xFF, 1)
    this.spriteAxis = this.game.add.sprite(this.x, this.y, bmdAxis)
    this.spriteAxis.alpha = 0.2
    this.spriteAxis.anchor.set(0.5)

    this.tween = this.game.add.tween(this.sprite.position).to({ x: this.x + this.dist }, 1500, Phaser.Easing.Sinusoidal.InOut, true)
    this.tween.yoyo(true)
    this.tween.repeat(-1)
  },

  update: function () {
    this.game.physics.arcade.overlap(this.sprite, players[0].sprite, players[0].kill, null, players[0])
  },

  setPosition: function (x, y) {
    this.y = y
    this.x = x
    this.sprite.position.set(x, y)
    this.spriteAxis.position.set(x, y)
  },

  stop: function () {
    this.tween.stop()
    this.setPosition(this.x, this.y)
  },

  sendToBack: function () {
    this.game.world.sendToBack(this.sprite)
    this.game.world.sendToBack(this.spriteAxis)
  }
}
