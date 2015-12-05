/*eslint-disable*/
/* global Phaser, players, colorHex, savedCheckpoint: true
*/
/*eslint-enable*/
var Checkpoint = function (game, mode, x, y) {
  this.game = game
  this.mode = mode
  this.x = x
  this.y = y
}

Checkpoint.prototype = {
  create: function () {
    this.sprite = this.game.add.sprite(this.x, this.y, 'checkpoint')
    this.sprite.name = 'checkpoint'
    this.sprite.anchor.set(0.5)
    this.game.physics.arcade.enable(this.sprite)

    this.text = this.game.add.text(this.x, this.y, 'c', {
      font: '60px dosis',
      fill: colorHex,
      align: 'center'
    })
    this.text.anchor.setTo(0.5, 0.58)
  },

  update: function () {
    if (this.text.alive) {
      var player = players[0].sprite
      this.game.physics.arcade.overlap(this.sprite, player, this.collect, null, this)
    }
  },

  collect: function () {
    var power = this.sprite
    this.text.kill()
    this.game.add.tween(power).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true)
    var powerTween = this.game.add.tween(power.scale).to({x: 0, y: 0}, 300, Phaser.Easing.Back.In, true)
    powerTween.onComplete.add(function () {
      power.destroy()
    }, this)
    savedCheckpoint.savedSize = players[0].size
    savedCheckpoint.position = {x: this.sprite.x, y: this.sprite.y}
    savedCheckpoint.score = this.mode.score
  },

  setPosition: function (x, y) {},

  stop: function () {},

  sendToBack: function () {},

  destroy: function () {},

  hide: function () {},

  show: function () {},

  setScale: function (scale) {},

  setAlpha: function (alpha) {}
}
