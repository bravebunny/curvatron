var OldSchool = function (game) {
  this.sp = true
  this.game = game
  this.nPlayers = -1
  this.player = null
  this.spawnPowers = true
  this.score = 0
  this.leaderboardID = modesLB[2]
  this.gridded = true
}

OldSchool.prototype = {
  preload: function () {
    this.game.load.image('point', 'assets/sprites/game/oldschool/point.png')
    this.game.load.image('player0', 'assets/sprites/game/oldschool/player.png')
    this.game.load.image('superPower', 'assets/sprites/game/oldschool/power.png')
    this.game.load.audio('sfx_collectOld', 'assets/sfx/collectOld.ogg')
    this.game.load.audio('sfx_killOld', 'assets/sfx/killOld.ogg')
  },

  create: function () {
    colorHex = '#8eb367'
    colorHexDark = '#475933'

    if (!mobile) {
      tempLabelText.style.fill = colorHex
    }
    collectSound = this.game.add.audio('sfx_collectOld')
    killSound = this.game.add.audio('sfx_killOld')

    var textSize = 20
    if (mobile) {
      textSize = 30
    }

    powerText = this.game.add.text(0, 0, '1', {
      font: '' + textSize + 'px dosis',
      fill: colorHex,
      align: 'center'
    })
    powerText.anchor.setTo(0.5, 0.5)

    var orientation = Math.abs(window.orientation) - 90 == 0 ? 'landscape' : 'portrait'
    var x, y
    if (orientation == 'landscape' || !mobile) {
      x = 1.5 * w2
      y = h2
    } else {
      x = w2
      y = h2 * 0.5
    }
    this.score = 0
    this.player = new OldPlayer(x, y, this, this.game)
    this.player.create()
    players[0] = this.player
  },

  update: function () {
    this.player.update()
  },

  erasesTrail: function () {},

  getScore: function () {
    return this.score
  },

  getHighScore: function () {
    var score = parseInt(localStorage.getItem('oldSchool'))
    if (isNaN(score)) {
      return 0
    } else {
      return score
    }
  },

  createPower: function () {
    var powerup = new PowerUp(this.game, 'point', this)
    powerup.create()
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
    var powerup = new PowerUp(this.game, 'point', this)
    powerup.create()

    var ballsScore = parseInt(localStorage.getItem('ballsScore'))
    if (isNaN(ballsScore)) {
      ballsScore = 0
    }
    localStorage.setItem('ballsScore', ballsScore + 1)

    if ((nextBallHigh == 0) && (this.score == highScore - 1)) {
      nextBallHigh = 1
    }
  }

}
