/*eslint-disable*/
/* global Phaser, players
*/
/*eslint-enable*/
var Rotator = function (game, x, y) {
  this.game = game
  this.x = x
  this.y = y

  // Obstacle properties
  this.size = 96
  this.dist = 224
  this.sprite = null

  // Axis properties
  this.thickness = 16
  this.spriteAxis = null
}

Rotator.prototype = {
  create: function () {
    var bmd = this.game.add.bitmapData(this.size, this.size)
    bmd.fill(0xFF, 0xFF, 0xFF, 1)
    this.sprite = this.game.add.sprite(this.x, this.y, bmd)
    this.sprite.anchor.set(0.5)
    this.game.physics.arcade.enable(this.sprite)

    var bmdAxis = this.game.add.bitmapData(this.dist, this.thickness)
    bmdAxis.fill(0xFF, 0xFF, 0xFF, 1)
    this.spriteAxis = this.game.add.sprite(this.x, this.y, bmdAxis)
    this.spriteAxis.alpha = 0.2
    this.spriteAxis.anchor.y = 0.5
  },

  update: function () {
    this.sprite.position.rotate(this.x, this.y, 2, true, this.dist)
    this.spriteAxis.angle += 2

    this.game.physics.arcade.overlap(this.sprite, players[0].sprite, players[0].kill, null, players[0])
  },

  setPosition: function (x, y) {
    this.y = y
    this.x = x
    this.sprite.position.set(x + this.dist, y)
    this.spriteAxis.position.set(x, y)
    if (this.circle) this.circle.position.set(x, y)
  },

  stop: function () {
    this.setPosition(this.x, this.y)
    var graphics = this.game.add.graphics(0, 0)
    graphics.lineStyle(this.size)
    graphics.lineColor = 0xFFFFFF
    graphics.drawCircle(0, 0, this.dist * 2.05)
    graphics.endFill()
    this.circle = this.game.add.sprite(this.x, this.y, graphics.generateTexture())
    this.circle.anchor.set(0.5)
    this.circle.alpha = 0.2
    graphics.destroy()
  },

  sendToBack: function () {
    this.game.world.sendToBack(this.sprite)
    this.game.world.sendToBack(this.spriteAxis)
    if (this.circle) this.game.world.sendToBack(this.circle)
  },

  destroy: function () {
    this.sprite.destroy()
    this.spriteAxis.destroy()
    if (this.circle) this.circle.destroy()
  },

  hide: function () {
    this.sprite.visible = false
    this.spriteAxis.visible = false
    if (this.circle) this.circle.visible = false
  },

  show: function () {
    this.sprite.alpha = 0.5
    this.spriteAxis.alpha = 0.2
    this.sprite.visible = true
    this.spriteAxis.visible = true
    if (this.circle) {
      this.circle.visible = true
      this.circle.alpha = 0.2
    }
  },

  setScale: function (scale) {
    this.dist *= scale
    this.sprite.position.set(this.x + this.dist, this.y)
    this.sprite.scale.set(scale)
    this.spriteAxis.scale.set(scale)
    if (this.circle) this.circle.scale.set(scale)
  }
}
