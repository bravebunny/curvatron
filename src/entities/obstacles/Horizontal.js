/*eslint-disable*/
/* global Phaser, players
*/
/*eslint-enable*/
var Horizontal = function (game, x, y) {
  this.game = game
  this.x = x
  this.y = y

  this.w = 224
  this.h = 32
  this.dist = 160
  this.sprite = null

  this.spriteAxis = null
  this.isDoor = false
}

Horizontal.prototype = {
  create: function () {
    var bmd = this.game.make.bitmapData(this.w, this.h)
    bmd.fill(0xFF, 0xFF, 0xFF, 1)
    var x = this.isDoor ? this.x - this.h/2 : this.x - this.dist
    this.sprite = this.game.add.sprite(x, this.y, bmd)
    var anchorX = this.isDoor ? 0 : 0.5
    this.sprite.anchor.set(anchorX, 0.5)
    this.game.physics.arcade.enable(this.sprite)

    var axisW= this.isDoor ? this.w + this.dist * 2 - this.h/2 : this.w + this.dist * 2
    var bmdAxis = this.game.make.bitmapData(axisW, this.h * 0.7)
    bmdAxis.fill(0xFF, 0xFF, 0xFF, 1)
    this.spriteAxis = this.game.add.sprite(this.x, this.y, bmdAxis)
    this.spriteAxis.alpha = 0.2
    this.spriteAxis.anchor.set(anchorX, 0.5)

    if (!this.isDoor) {
      this.tween = this.game.add.tween(this.sprite.position).to({ x: this.x + this.dist }, 1500, Phaser.Easing.Sinusoidal.InOut, true)
      this.tween.yoyo(true)
      this.tween.repeat(-1)
    }

  },

  update: function () {
    this.game.physics.arcade.overlap(this.sprite, players[0].sprite, players[0].kill, null, players[0])
    if (this.isDoor) {
      var w = this.sprite.width
      var dir = players[0].direction
      var inc = 0
      if (dir === 1 && w > this.h) inc = -1
      else if (dir === -1 && w < this.spriteAxis.width) inc = 1
      this.sprite.width += 5 * inc
    }
  },

  setPosition: function (x, y) {
    this.y = y
    this.x = x
    this.sprite.position.set(x, y)
    this.spriteAxis.position.set(x, y)
    if (this.center) this.center.position.set(x, y)
  },

  stop: function () {
    if (this.tween) this.tween.stop()
    this.setPosition(this.x, this.y)

    var graphics = this.game.add.graphics(0, 0)
    graphics.lineStyle(5)
    graphics.lineColor = 0xFFFFFF
    graphics.drawRect(this.x - 16, this.y - 16, 32, 32)
    graphics.endFill()

    this.center = this.game.add.sprite(this.x, this.y, graphics.generateTexture())
    this.center.anchor.set(0.5)

    graphics.destroy()
  },

  sendToBack: function () {
    this.game.world.sendToBack(this.sprite)
    this.game.world.sendToBack(this.spriteAxis)
    if (this.center) this.game.world.sendToBack(this.center)
  },

  destroy: function () {
    this.sprite.destroy()
    this.spriteAxis.destroy()
    if (this.center) this.center.destroy()
  },

  hide: function () {
    this.sprite.visible = false
    this.spriteAxis.visible = false
    if (this.center) this.center.visible = false
  },

  show: function () {
    this.sprite.visible = true
    this.spriteAxis.visible = true
    if (this.center) this.center.visible = true
  },

  setScale: function (scale) {
    this.sprite.scale.set(scale)
    this.spriteAxis.scale.set(scale)
    if (this.center) this.center.scale.set(scale)
  },

  setAlpha: function (alpha) {
    this.sprite.alpha = 0.8 * alpha
    this.spriteAxis.alpha = 0.4 * alpha
    if (this.circle) this.circle.alpha = 0.4 * alpha
  }
}