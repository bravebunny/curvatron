/*eslint-disable*/
/* global players, baseW, baseH, Phaser, setScreenFixed, colorHex, bmd:true,
  w2:true, h2:true, powerText:true, localStorage, PowerUp, nextBallHigh:true,
  scale
*/
/*eslint-enable*/
var Adventure = function (game, testing) {
  this.sp = true
  this.game = game
  this.spawnPowers = true
  this.countPoints = true
  this.map = null
  this.layer = null
  this.powerText = null
  this.name = 'adventure'

  this.mapW = 60
  this.mapH = 34
  this.tileSize = 32

  this.testing = testing

  this.values = {
    start: 35,
    wall: 1,
    empty: 0
  }
}

Adventure.prototype = {
  preload: function () {
    setScreenFixed(baseW, baseH, this.game)

    this.game.load.image('player0', 'assets/sprites/game/singleplayer/player.png')
    this.game.load.image('superPower', 'assets/sprites/game/singleplayer/powerHS.png')
    this.game.load.image('point', 'assets/sprites/game/singleplayer/point.png')
    this.game.load.spritesheet('shrink', 'assets/sprites/game/singleplayer/shrink.png', 100, 100)

    this.game.load.image('Pastel', 'assets/levels/Pastel.png') // loading the tileset image
    this.game.load.tilemap('blank', 'assets/levels/blank.json', null, Phaser.Tilemap.TILED_JSON) // loading the tilemap file
  },

  create: function () {
    // varialbes that need to be reset on startup
    this.score = 0
    this.pointPositions = []
    this.player = players[0]

    // redo bitmapData
    bmd = null
    bmd = this.game.add.bitmapData(this.game.width, this.game.height)
    bmd.addToWorld()
    bmd.smoothed = false

    w2 = this.game.world.width / 2
    h2 = this.game.world.height / 2

    bmd.width = 2 * w2
    bmd.height = 2 * h2

    players[0].x = w2
    players[0].y = h2

    this.powerText = this.game.add.text(0, 0, '1', {
      font: '15px dosis',
      fill: colorHex,
      align: 'center'
    })
    this.powerText.anchor.setTo(0.5, 0.5)

    this.score = 0

    this.map = this.game.add.tilemap('blank')
    this.map.addTilesetImage('Pastel') // Preloaded tileset

    var levelArray = this.game.cache.getText('level').split('')

    for (var x = 0; x < this.mapW; x++) {
      for (var y = 0; y < this.mapH; y++) {
        var val = parseInt(levelArray[x * this.mapH + y], 36)
        if (val === this.values.wall) this.map.putTile(0, x, y)
        else if (val === this.values.start) {
          players[0].x = x * this.tileSize + this.tileSize / 2
          players[0].y = y * this.tileSize + this.tileSize / 2 + 5
        } else if (val > 1) {
          this.pointPositions[val - 2] = {}
          var point = this.pointPositions[val - 2]
          point.x = x * this.tileSize - this.tileSize / 2
          point.y = y * this.tileSize - this.tileSize / 2
        }
      }
    }

    this.layer = this.map.createLayer('obstacles') // layer[0]
    this.map.setCollisionByIndex(0)

    // this.map.setCollisionByExclusion([], true, this.layer)
  },

  update: function () {
    if (this.game.physics.arcade.collide(players[0].sprite, this.layer)) {
      players[0].kill()
    }
  },

  erasesTrail: function () {
    return true
  },

  getScore: function () {
    return this.score
  },

  getHighScore: function () {
    var score = parseInt(localStorage.getItem('highScore'), 10)
    if (isNaN(score)) {
      return 0
    } else {
      return score
    }
  },

  setScore: function (score) {
    this.score = score
  },

  setHighScore: function (score) {
    localStorage.setItem('highScore', score)
  },

  submitScore: function () {
    if (this.score > this.getHighScore()) {
      this.setHighScore(this.score)
    }
  },

  collect: function (player, power) {
    this.score++

    if (this.score >= this.pointPositions.length) {
      this.nextLevel()
    } else {
      this.createPower()
    }

    if (this.score >= this.pointPositions.length - 2) {
      nextBallHigh = 1
    }

    this.player.size += this.player.growth

    var ballsScore = parseInt(localStorage.getItem('ballsScore'), 10)
    if (isNaN(ballsScore)) {
      ballsScore = 0
    }
    localStorage.setItem('ballsScore', ballsScore + 1)
  },

  createPower: function () {
    if (this.pointPositions[this.score]) {
      var powerup = new PowerUp(this.game, 'point', this, this.pointPositions[this.score].x, this.pointPositions[this.score].y)
      powerup.create()

      var number = this.pointPositions.length - this.score - 1
      if (number > 0) {
        this.powerText.setText(this.pointPositions.length - this.score - 1)
        this.powerText.x = powerup.sprite.x
        this.powerText.y = powerup.sprite.y + 2 * scale
      } else {
        this.powerText.visible = false
      }
    }
  },

  nextLevel: function () {
    /*
    var mode = new Adventure(this.game, this.level + 1)
    this.game.state.start('PreloadGame', true, false, mode, this.level + 1) */
    // TODO
  }

}
