/*eslint-disable*/
/* global scale, Phaser, players
*/
/*eslint-enable*/
var Rotator = function (game, x, y) {
  this.game = game
  this.x = x
  this.y = y
  var axisDist = 200

  // Obstacle properties
  this.size = 100 * scale
  this.dist = axisDist * scale
  this.sprite = null

  // Axis properties
  this.w = axisDist * scale
  this.h = 30 * scale
  this.spriteAxis = null
}

Rotator.prototype = {
  create: function () {
    var bmd = this.game.add.bitmapData(this.size, this.size)
    bmd.fill(0xFF, 0xFF, 0xFF, 1)
    this.sprite = this.game.add.sprite(this.x, this.y, bmd)
    this.sprite.anchor.set(0.5)
    this.game.physics.arcade.enable(this.sprite)

    var bmdAxis = this.game.add.bitmapData(this.w, this.h * 0.7)
    bmdAxis.fill(0xFF, 0xFF, 0xFF, 1)
    this.spriteAxis = this.game.add.sprite(this.x, this.y, bmdAxis)
    this.spriteAxis.alpha = 0.2
    this.spriteAxis.anchor.y = 0.2
  },

  update: function () {
    this.sprite.position.rotate(this.x, this.y, 2, true, this.dist)
    this.spriteAxis.angle += 2

    this.game.physics.arcade.overlap(this.sprite, players[0].sprite, players[0].kill, null, players[0])
  },

  setPosition: function (x, y) {
    this.y = y
    this.x = x
    this.sprite.position.rotate(x, y, 2, true, this.dist)
    spriteAxis.position.set(x, y)
  },

  stop: function () {

  }
}
