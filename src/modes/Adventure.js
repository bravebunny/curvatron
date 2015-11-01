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
    // this.player.setInputTimes([1233.3333333333333, 1916.6666666666697, 2599.9999999999986, 3266.6666666666592, 3949.9999999999864, 4666.666666666662, 5300.000000000007, 5783.333333333349, 6233.333333333358, 6616.666666666698, 7650.00000000005, 7883.333333333388, 8350.000000000055, 8833.33333333337, 9350.000000000018, 9833.333333333334, 10249.999999999985, 10666.666666666637, 11083.333333333288, 11549.999999999938, 12016.666666666588, 12416.666666666573, 12783.333333333227, 13799.999999999856, 14166.66666666651, 14616.666666666493, 15166.666666666473, 15733.33333333312, 16166.666666666437, 16783.333333333125, 17199.99999999982, 17683.33333333319, 18099.999999999887, 18549.99999999992, 19166.66666666663, 19766.666666666675])
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
      this.point.x = this.pointPositions[this.score].x
      this.point.y = this.pointPositions[this.score].y
      this.point.type = pointName
      this.point.create()
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
