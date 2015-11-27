/*eslint-disable*/
/* global scale, Phaser, players
*/
/*eslint-enable*/
var Rotator = function (game, x, y) {
  this.game = game
  this.x = x
  this.y = y

  this.size = 50 * scale
  this.dist = 100 * scale
  this.sprite = null
}

Rotator.prototype = {
  create: function () {
    var bmd = this.game.add.bitmapData(this.size, this.size)
    bmd.fill(0xFF, 0xFF, 0xFF, 1)
    this.sprite = this.game.add.sprite(0, 0, bmd)
    this.sprite.anchor.set(0.5)
    this.game.physics.arcade.enable(this.sprite)
  },

  update: function () {
    this.sprite.position.rotate(this.x, this.y, 2, true, this.dist)
    this.game.physics.arcade.overlap(this.sprite, players[0].sprite, players[0].kill, null, players[0])
  }
}
