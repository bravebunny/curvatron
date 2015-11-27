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
}

Horizontal.prototype = {
  create: function () {
    var bmd = this.game.add.bitmapData(this.w, this.h)
    bmd.fill(0xFF, 0xFF, 0xFF, 1)
    this.sprite = this.game.add.sprite(this.x - this.dist, this.y, bmd)
    this.sprite.anchor.set(0.5)
    this.game.physics.arcade.enable(this.sprite)

    var tween = this.game.add.tween(this.sprite.position).to({ x: this.x + this.dist }, 1500, Phaser.Easing.Sinusoidal.InOut, true)
    tween.yoyo(true)
    tween.repeat(-1)
  },

  update: function () {
    this.game.physics.arcade.overlap(this.sprite, players[0].sprite, players[0].kill, null, players[0])
  }
}
