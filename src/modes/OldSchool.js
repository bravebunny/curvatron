/*eslint-disable*/
/* global leaderboardButton:true, moveSounds:true, tempLabel:true, bmd:true,
menuMusic, pauseSprite, colisionMargin, scale:true, players:true, gameOver:true,
muteAudio:true, paused:true, totalTime:true, pauseTween:true, borders:true,
colisionMargin:true, nextBallHigh:true, changeColor:true, killSound:true,
collectSound:true, Phaser, w2, h2, groupPowers:true, tempLabelText:true,
colorHex:true, keys, colorHexDark:true, bgColor:true, mute:true, ButtonList,
clickButton, localStorage, PowerUp, OldPlayer, modesLB, adjustScreen */
/*eslint-enable*/
var OldSchool = function (game) {
  this.sp = true
  this.game = game
  this.nPlayers = -1
  this.player = null
  this.spawnPowers = true
  this.score = 0
  this.leaderboardID = modesLB[2]
  this.gridded = true
  this.countPoints = true
  this.powerText = null
  this.powerup = null
  this.name = 'old school'
}

OldSchool.prototype = {
  create: function () {
    collectSound = this.game.add.audio('sfx_collectOld')
    killSound = this.game.add.audio('sfx_killOld')

    var textSize = 20
    this.powerText = this.game.add.text(0, 0, '1', {
      font: '' + textSize + 'px dosis',
      fill: colorHex,
      align: 'center'
    })
    this.powerText.anchor.setTo(0.5, 0.5)

    var x = 1.5 * w2
    var y = h2

    this.score = 0
    this.player = new OldPlayer(x, y, this, this.game)
    this.player.create()
    players[0] = this.player

    this.powerup = new PowerUp(this.game, 'old_point', this)
    this.createPower(false)
  },

  update: function () {
    this.player.update()
  },

  setScreen: function () {
    adjustScreen(this.game)
  },

  erasesTrail: function () {},

  getScore: function () {
    return this.score
  },

  getHighScore: function () {
    var score = parseInt(localStorage.getItem('oldSchool'), 10)
    if (isNaN(score)) {
      return 0
    } else {
      return score
    }
  },

  createPower: function (high) {
    if (this.powerup.effectSprite) this.powerup.effectSprite.alpha = 0 // only to hide the effectSprite created on point nº1
    this.powerup.type = 'old_point'
    if (high) this.powerup.type = 'old_pointSuper'
    var x = this.game.rnd.integerInRange(32 / scale, 2 * w2 - 32 / scale)
    var y = this.game.rnd.integerInRange(32 / scale, 2 * h2 - 32 / scale)
    this.powerup.x = x
    this.powerup.y = y
    this.powerup.create()
  },

  getPointText: function () {
    return this.score + 1
  },

  setScore: function (score) {
    this.score = score
  },

  setHighScore: function (score) {
    localStorage.setItem('oldSchool', score)
  },

  submitScore: function () {
    if (this.score > this.getHighScore()) {
      this.setHighScore(this.score)
    }
  },

  collect: function (player, power) {
    this.score++
    var highScore = this.getHighScore()

    if ((this.score === highScore)) {
      this.createPower(true)
    } else {
      this.createPower(false)
    }

    var ballsScore = parseInt(localStorage.getItem('ballsScore'), 10)
    if (isNaN(ballsScore)) {
      ballsScore = 0
    }
    localStorage.setItem('ballsScore', ballsScore + 1)
  },

  setColors: function () {
    colorHex = '#8eb367'
    colorHexDark = '#475933'
  }
}
