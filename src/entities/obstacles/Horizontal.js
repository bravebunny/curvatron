/*eslint-disable*/
/* global scale, Phaser, players
*/
/*eslint-enable*/
var Horizontal = function (game, x, y) {
  this.game = game
  this.x = x
  this.y = y

  this.w = 224 * scale
  this.h = 32 * scale
  this.dist = 160 * scale
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

    var bmdAxis = this.game.add.bitmapData(this.w + this.dist * 2, this.h * 0.7)
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
  },

  destroy: function () {
    this.sprite.destroy()
    this.spriteAxis.destroy()
  },

  hide: function () {
    this.sprite.visible = false
    this.spriteAxis.visible = false
  },

  show: function () {
    this.sprite.alpha = 0.5
    this.spriteAxis.alpha = 0.2
    this.sprite.visible = true
    this.spriteAxis.visible = true
  }
}
