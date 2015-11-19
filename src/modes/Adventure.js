/*eslint-disable*/
/* global players, baseW, baseH, Phaser, setScreenFixed, colorHex, bmd:true,
  w2:true, h2:true, powerText:true, localStorage, PowerUp, nextBallHigh:true,
  scale
*/
/*eslint-enable*/
var Adventure = function (game, testing, items, index) {
  this.sp = true
  this.game = game
  this.spawnPowers = true
  this.countPoints = true
  this.map = null
  this.layer = null
  this.powerText = null
  this.name = 'adventure'
  this.items = items
  this.index = index
  this.margin = 400

  this.scale = 1
  this.defaults = {
    mapW: 60,
    mapH: 34,
    length: 60 * 34
  }
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

    w2 = this.game.width / 2
    h2 = this.game.height / 2

    bmd.width = 2 * w2
    bmd.height = 2 * h2

    players[0].x = w2
    players[0].y = h2

    this.powerText = this.game.add.text(0, 0, '1', {
      font: '20px dosis',
      fill: colorHex,
      align: 'center'
    })
    this.powerText.anchor.setTo(0.5, 0.5)

    this.score = 0

    var levelArray = this.game.cache.getText('level').split('')

    this.scale = Math.sqrt(levelArray.length / this.defaults.length)
    this.mapW = this.defaults.mapW * this.scale
    this.mapH = this.defaults.mapH * this.scale

    this.map = this.game.add.tilemap()
    this.map.addTilesetImage('block')
    this.layer = this.map.create('obstacles', this.mapW, this.mapH, this.tileSize, this.tileSize)
    this.layer.resizeWorld()

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
          point.x = x * this.tileSize + this.tileSize / 2
          point.y = y * this.tileSize + this.tileSize / 2
        }
      }
    }

    this.map.setCollisionByIndex(0)

    this.point = new PowerUp(this.game, 'point', this, 0, 0)
    this.createPower()

    // debug stuff.
    // this.player.setInputTimes([516.6666666666669, 866.6666666666661, 1316.666666666667, 1683.3333333333353, 1883.3333333333362, 2266.6666666666683, 2450, 3249.9999999999927, 3483.333333333324, 3883.3333333333203, 4466.666666666659, 4766.666666666664, 5100.000000000004, 5283.33333333334, 5766.666666666682, 6066.666666666688, 6866.666666666702, 7416.666666666712, 8033.33333333339, 8416.666666666719, 8700.000000000042, 9183.333333333358, 9949.999999999996, 10299.999999999984, 10833.333333333298, 11283.333333333281, 11833.333333333261, 12383.333333333241, 12616.666666666566])
  },

  setScreen: function () {
    var game = this.game
    var w = baseW
    var h = baseH
    game.width = w
    game.height = h
    game.canvas.width = w
    game.canvas.height = h
    game.renderer.resize(w, h)
    game.scale.width = w
    game.scale.height = h
    game.camera.setSize(w, h)
    game.scale.refresh()
  },

  update: function () {
    if (this.game.physics.arcade.collide(players[0].sprite, this.layer)) {
      players[0].kill()
    }
  },

  setCamera: function () {
    this.game.world.setBounds(0, 4, this.mapW * this.tileSize, this.mapH * this.tileSize - 8)
    this.game.camera.follow(players[0].sprite)
    var m = this.margin
    var w = 2 * w2
    var h = 2 * h2
    this.game.camera.deadzone = new Phaser.Rectangle(m, m, w - 2 * m, h - 2 * m)
  },

  erasesTrail: function () {
    return true
  },

  getScore: function () {
    return this.score
  },

  setScore: function (score) {
    this.score = score
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
      var pointName
      if (this.score >= this.pointPositions.length - 1) pointName = 'pointSuper'
      else pointName = 'point'
      var powerup = new PowerUp(this.game, pointName, this, this.pointPositions[this.score].x, this.pointPositions[this.score].y)
      powerup.create()

      var number
      if (this.testing) number = this.score + 1
      else number = this.pointPositions.length - this.score - 1

      if (number > 0 || this.testing) {
        this.powerText.setText(number)
        this.powerText.x = powerup.sprite.x
        this.powerText.y = powerup.sprite.y + 2 * scale
      } else {
        this.powerText.visible = false
      }
    }
  },

  getPointText: function () {
    if (this.testing) return this.score + 1
    else {
      var number = this.pointPositions.length - this.score - 1
      if (number > 0) return number
      else return ''
    }
  },

  nextLevel: function () {
    if (this.testing) this.game.state.start('Editor', true, false, true, this.scale)
    else {
      this.index++
      this.game.state.start('PreloadGame', true, false, this, 'assets/levels/' + this.items[this.index])
    }
  }

}
