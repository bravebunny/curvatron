/*eslint-disable*/
/* global Phaser, players, colorHex
*/
/*eslint-enable*/
var Checkpoint = function (game, x, y) {
  this.game = game
  this.x = x
  this.y = y
}

Checkpoint.prototype = {
  create: function () {
    this.sprite = this.game.add.sprite(this.x, this.y, 'point')
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
    console.log(this.text.alive)
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
