/*eslint-disable*/
/* global Phaser, players
*/
/*eslint-enable*/
var Vertical = function (game, x, y) {
  this.game = game
  this.x = x
  this.y = y

  this.w = 32
  this.h = 224
  this.dist = 160
  this.sprite = null

  this.spriteAxis = null
  this.isDoor = false
}

Vertical.prototype = {
  create: function () {
    var bmd = this.game.add.bitmapData(this.w, this.h)
    bmd.fill(0xFF, 0xFF, 0xFF, 1)
    var y = this.isDoor ? this.y - this.w/2 : this.y - this.dist
    this.sprite = this.game.add.sprite(this.x, y, bmd)
    var anchorY = this.isDoor ? 0 : 0.5
    this.sprite.anchor.set(0.5, anchorY)
    this.game.physics.arcade.enable(this.sprite)

    var axisH= this.isDoor ? this.h + this.dist * 2 - this.w/2 : this.h + this.dist * 2
    var bmdAxis = this.game.add.bitmapData(this.w * 0.7, axisH)
    bmdAxis.fill(0xFF, 0xFF, 0xFF, 1)
    this.spriteAxis = this.game.add.sprite(this.x, this.y, bmdAxis)
    this.spriteAxis.alpha = 0.2
    this.spriteAxis.anchor.set(0.5, anchorY)

    if (!this.isDoor) {
      this.tween = this.game.add.tween(this.sprite.position).to({ y: this.y + this.dist }, 1500, Phaser.Easing.Sinusoidal.InOut, true)
      this.tween.yoyo(true)
      this.tween.repeat(-1)
    }
  },

  update: function () {
    this.game.physics.arcade.overlap(this.sprite, players[0].sprite, players[0].kill, null, players[0])
    if (this.isDoor) {
      var h = this.sprite.height
      var dir = players[0].direction
      var inc = 0
      if (dir === 1 && h > this.w) inc = -1
      else if (dir === -1 && h < this.spriteAxis.height) inc = 1
      this.sprite.height += 5 * inc
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
