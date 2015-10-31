/* global scale, w2, h2, Phaser, groupPowers, groupPointEffects, colorHex
*/
var PowerUp = function (game, type, mode, x, y) {
  this.mode = mode
  this.game = game
  this.type = type
  this.sprite = null
  this.spriteTween = null
  this.effectSprite = null
  this.x = x
  this.y = y
  this.size = 1
}

PowerUp.prototype = {
  create: function () {
    if (this.type.indexOf('point') > -1) {
      if (!this.mode.sp) {
        var randNum = this.game.rnd.integerInRange(0, 100)
        if (randNum < 60) {
          this.size = 1
        } else if (randNum < 80) {
          this.size = 2
        } else if (randNum < 95) {
          this.size = 3
        } else {
          this.size = 4
        }
      } else {
        this.size = 1
      }
    }

    if (!this.x && this.mode.gridded) {
      this.x = this.game.rnd.integerInRange(32 / scale, 2 * w2 - 32 / scale)
      this.y = this.game.rnd.integerInRange(32 / scale, 2 * h2 - 32 / scale)
    }

    if (!this.sprite) {
      console.log('created point')
      this.effectSprite = this.game.add.sprite(this.x, this.y, this.type)
      this.sprite = this.game.add.sprite(this.x, this.y, this.type)
      this.sprite.anchor.setTo(0.5, 0.5)
      this.effectSprite.anchor.setTo(0.5, 0.5)
      this.sprite.scale.set((this.size / 2) * scale)
      this.effectSprite.scale.set((this.size / 2) * scale)
      this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE)
      this.game.physics.enable(this.effectSprite, Phaser.Physics.ARCADE)
      this.sprite.context = this
      this.effectSprite.context = this
      groupPowers.add(this.sprite)
      groupPointEffects.add(this.effectSprite)

      this.text = this.game.add.text(0, 0, '1', {
        font: '20px dosis',
        fill: colorHex,
        align: 'center'
      })
      this.text.anchor.setTo(0.5, 0.5)
    } else {
      this.sprite.x = this.x
      this.sprite.y = this.y
      this.sprite.loadTexture(this.type)
      this.effectSprite.visible = true
    }

    if (!this.mode.sp || this.type === 'shrink') {
      this.sprite.alpha = 0
    }

    if (this.type === 'shrink') {
      this.effectSprite.x = this.x
      this.effectSprite.y = this.y
      var anim = this.effectSprite.animations.add('timed')
      anim.play(1.5, false, true)
    } else {
      var pointText = ''
      if (this.mode.getPointText) pointText = this.mode.getPointText()
      this.text.setText(pointText)
      this.text.x = this.x
      this.text.y = this.y + 2 * scale
    }

    this.sprite.name = this.type

    if (this.mode.sp) {
      this.spriteTween = this.game.add.sprite(this.x, this.y, this.type)
      this.spriteTween.anchor.setTo(0.5, 0.5)
      this.spriteTween.scale.set((this.size / 2) * scale)
      if (this.type.indexOf('point') > -1) {
        this.game.add.tween(this.spriteTween).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true)
        this.game.add.tween(this.spriteTween.scale).to({x: 4, y: 4}, 1000, Phaser.Easing.Linear.None, true)
      } else if (this.mode.sp && (this.type === 'shrink')) {
        this.game.add.tween(this.spriteTween).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true)
        this.game.add.tween(this.spriteTween.scale).to({x: 2, y: 2}, 1000, Phaser.Easing.Linear.None, true)
      }
    }
  },

  setPosition: function (x, y) {
    this.sprite.x = x
    this.sprite.y = y
  },

  setAlpha: function (a) {
    this.sprite.alpha = a
  },

  setScale: function (s) {
    this.sprite.scale.setTo(s)
  },

  getEffectSprite: function () {
    return this.effectSprite
  },

  resetEffect: function () {
    this.effectSprite.scale.set((this.size / 2) * scale)
    this.effectSprite.x = this.x
    this.effectSprite.y = this.y
    if (this.type === 'shrink') this.effectSprite.visible = false
  },

  render: function () {
    // this.game.debug.body(this.sprite)
  }
}
