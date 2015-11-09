/* global points:true, modesLB, h2, w2, players,
shuffleArray, localStorage, scale, PowerUp, Phaser, adjustScreen
*/
var Normal = function (game) {
  this.sp = true
  this.game = game
  this.spawnPowers = true
  this.leaderboardID = modesLB[0]
  this.shrinkFreq = 5
  this.obstacleGroup = null
  this.cellSize = 64
  this.countPoints = true
  this.point = null
  this.name = 'normal'
}

Normal.prototype = {
  create: function () {
    this.rows = Math.floor(h2 * 1.9 / this.cellSize)
    this.columns = Math.floor(w2 * 1.9 / this.cellSize)
    this.marginX = (2 * w2 - this.columns * this.cellSize + this.cellSize) * 0.5
    this.marginY = (2 * h2 - this.rows * this.cellSize + this.cellSize) * 0.5
    this.score = 0
    this.obstacleGroup = this.game.add.group()
    this.pointsPow = []
    this.pointsObs = []
    this.lastPoint = null
    this.player = players[0]
    this.shrink = null

    // create grid points
    for (var i = 0; i < this.columns; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.pointsPow.push({x: i, y: j})
      }
    }
    this.pointsPow = shuffleArray(this.pointsPow)

    // create grid points
    for (i = 0; i < this.columns * 0.5; i++) {
      for (j = 0; j < this.rows * 0.5; j++) {
        this.pointsObs.push({x: i * 2, y: j * 2})
      }
    }
    this.pointsObs = shuffleArray(this.pointsObs)

    this.shrink = new PowerUp(this.game, 'shrink', this, 0, 0)
    this.point = new PowerUp(this.game, 'point', this, 0, 0)
    this.createPower('point')
  },

  update: function () {},

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

  collect: function (playerSprite, powerSprite) {
    var point = this.lastPoint
    if (point) {
      this.pointsPow.push(point)
      this.pointsPow = shuffleArray(this.pointsPow)

      if (point.x % 2 === 0 && point.y % 2 === 0) {
        this.pointsObs.push(point)
        this.pointsObs = shuffleArray(this.pointsObs)
      }

      if (this.getScore() % 5 === 4) {
        this.player.growth += 5
      }
    }

    var highScore = this.getHighScore()
    var pointName = 'point'
    if ((this.score === highScore - 1)) {
      pointName = 'pointSuper'
    }

    if (powerSprite.name.indexOf('point') > -1) {
      this.score++
      this.createPower(pointName)

      // if (((this.score % this.shrinkFreq) === this.shrinkFreq-1) && (this.score > 0)) {
      if (((this.score % this.shrinkFreq) === this.shrinkFreq - 1) && (this.score > 0)) {
        this.createPower('shrink')
      }
    }

    var ballsScore = parseInt(localStorage.getItem('ballsScore'), 10)
    if (isNaN(ballsScore)) {
      ballsScore = 0
    }
    localStorage.setItem('ballsScore', ballsScore + 1)

    if (powerSprite.name === 'shrink') {
      for (var i = 0; i < 3; i++) {
        if (!this.gridIsFull()) {
          this.createObstacle()
        }
      }
      // this.shrink = null
    }

    if (powerSprite.name.indexOf('point') > -1) {
      this.player.size += this.player.growth
    } else if (powerSprite.name === 'shrink') {
      this.player.shrink = true
      this.player.size = this.player.initialSize
    }
  },

  gridIsFull: function () {
    return (!this.pointsObs[0])
  },

  createPower: function (type) {
    var collidesWithPlayer = true

    while (collidesWithPlayer) {
      collidesWithPlayer = false

      this.lastPoint = this.pointsPow.pop()
      var x = (this.lastPoint.x) * this.cellSize + this.marginX
      var y = (this.lastPoint.y) * this.cellSize + this.marginY

      var collSize = 16 * scale
      for (var j = 0; j < this.player.trailArray.length; j++) {
        var curTrail = this.player.trailArray[j]
        if (curTrail && curTrail.x - collSize < x && curTrail.x + collSize > x &&
          curTrail.y - collSize < y && curTrail.y + collSize > y) {
          collidesWithPlayer = true
          var point = this.lastPoint
          this.pointsPow.push(point)
          this.pointsPow = shuffleArray(this.pointsPow)
          break
        }
      }
    }

    var powerup = this.point
    if (type === 'shrink') {
      powerup = this.shrink
      this.shrink.x = x
      this.shrink.y = y
      this.shrink.create()
    } else {
      this.point.type = type
      this.point.x = x
      this.point.y = y
      this.point.create()
    }

    for (var i = 0; i < this.pointsObs.length; i++) {
      if (JSON.stringify(this.pointsObs[i]) === JSON.stringify(this.lastPoint)) {
        this.pointsObs.splice(i, 1)
        break
      }
    }
  },

  getPointText: function () {
    return this.score + 1
  },

  createObstacle: function () {
    points = this.pointsObs.pop()

    var x = points.x * this.cellSize + this.marginX
    var y = points.y * this.cellSize + this.marginY

    /*
    var x = rx*this.cellSize*2-w2*0.05
    var y = ry*this.cellSize*2-h2*0.05
    */

    var obstacle = this.game.add.sprite(x, y, 'obstacle')
    var tweenObstacle = this.game.add.sprite(x, y, 'obstacle')
    obstacle.scale.set(1.5)
    obstacle.alpha = 0
    obstacle.anchor.setTo(0.5, 0.5)
    tweenObstacle.anchor.setTo(0.5, 0.5)
    tweenObstacle.scale.set(0.5)
    tweenObstacle.alpha = 0.0

    var obstacleTween1 = this.game.add.tween(obstacle.scale).to({x: 0.5, y: 0.5}, 4000, Phaser.Easing.Quadratic.In, true)
    var obstacleTween2 = this.game.add.tween(obstacle).to({ alpha: 0.25 }, 2000, Phaser.Easing.Linear.None, true)
    var obstacleTween3 = this.game.add.tween(tweenObstacle.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Linear.None, false)
    var obstacleTween4 = this.game.add.tween(tweenObstacle).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, false)
    obstacleTween1.onComplete.add(function () {
      obstacle.alpha = 0.5
      tweenObstacle.alpha = 0.5
      obstacleTween3.start()
      obstacleTween4.start()
      this.game.physics.enable(obstacle, Phaser.Physics.ARCADE)
    }, this)
    this.obstacleGroup.add(obstacle)

    for (var i = 0; i < this.pointsPow.length; i++) {
      if (JSON.stringify(this.pointsPow[i]) === JSON.stringify(points)) {
        this.pointsPow.splice(i, 1)
        break
      }
    }
  },

  pause: function () {
    if (this.shrink && this.shrink.sprite && this.shrink.sprite.animations) {
      this.shrink.sprite.animations.paused = true
    }
  },

  unPause: function () {
    if (this.shrink && this.shrink.sprite && this.shrink.sprite.animations) {
      this.shrink.sprite.animations.paused = false
    }
  },

  setScreen: function () {
    adjustScreen(this.game)
  },

  render: function () {
    // call renderGroup on each of the alive members
    // this.obstacleGroup.forEachAlive(this.renderGroup, this)
  },

  renderGroup: function (member) {
    // this.game.debug.body(member)
  }

}
