/*eslint-disable*/
/* global global Phaser, keys, scale, w2, h2, groupPowers, borders, paused,
  totalTime, bmd, colisionMargin, gameOver, tempLabel, tempLabelText,
  pauseSprite, localStorage, mute, killSound, collectSound, colorHexDark */
/*eslint-enable*/
var OldPlayer = function (x, y, mode, game) {
  this.game = game
  this.mode = mode
  this.sprite

  this.direction = 1
  this.distance = 0
  this.maxDistance = 40
  this.angle = 0
  this.speed = 3

  this.x = x
  this.y = y
  this.key = keys[0]
  this.killTrail = false
  this.dead = false
  this.growth = 60
  this.lastTrailLength = 0
  this.keyText = null
  this.paused = false
  this.textTween = null
  this.trailArray = []
  this.touch = null
  this.collectSemaphore = 0
  this.orientation = null
  this.color = Phaser.Color.hexToColor('#FFFFFF')
  this.keyUpVar = true
}

OldPlayer.prototype = {
  create: function () {
    this.orientation = Math.abs(window.orientation) - 90 === 0 ? 'landscape' : 'portrait'

    this.sprite = this.game.add.sprite(this.x, this.y, 'old_player')
    this.sprite.anchor.setTo(0.5, 0.5)
    this.sprite.scale.set(scale)

    this.trail = this.game.make.sprite(0, 0, 'old_trail')
    this.trail.anchor.set(0.5)
    this.lastTrailLength = this.growth

    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE)

    this.game.input.onDown.add(this.keyPressed, this)
    this.game.input.onUp.add(this.keyUp, this)
    this.input = this.game.input.keyboard.addCallbacks(this, this.keyPressed, this.keyUp)
  },

  update: function () {
    if (!this.paused && paused) {
      this.paused = true
      this.pause()
    } else if (this.paused && !paused) {
      this.paused = false
    }

    if (!this.paused) {
      this.sprite.angle = 90 * this.angle

      switch (this.angle) {
        case 0:
          this.sprite.x += this.speed
          break
        case 1:
          this.sprite.y += this.speed
          break
        case 2:
          this.sprite.x -= this.speed
          break
        case 3:
          this.sprite.y -= this.speed
          break
      }

      if (this.distance >= this.maxDistance) {
        this.distance = 0
        this.angle = this.angle + this.direction
        if (this.angle > 3) {
          this.angle = 0
        } else if (this.angle < 0) {
          this.angle = 3
        }
      } else {
        this.distance++
      }

      if (!this.sprite.alive) {
        this.kill()
      }

      var xx = Math.cos(this.sprite.rotation) * 18 * scale + this.sprite.x
      var yy = Math.sin(this.sprite.rotation) * 18 * scale + this.sprite.y

      if (!this.dead) {
        // Create trail
        trailPiece = {'x': this.sprite.x, 'y': this.sprite.y, 'n': 1}
        this.trailArray.push(trailPiece)
        bmd.draw(this.trail, this.sprite.x, this.sprite.y)
        // collision detection
        var collSize = 12 * scale
        for (var j = 0; j < this.trailArray.length; j++) {
          var curTrail = this.trailArray[j]
          if (curTrail && curTrail.x - collSize < xx && curTrail.x + collSize > xx &&
            curTrail.y - collSize < yy && curTrail.y + collSize > yy) {
            this.kill()
          }
        }
      }
      this.game.physics.arcade.overlap(this.sprite, groupPowers, this.collect, null, this)

      var trailPiece = null
      var ctx = bmd.context

      // erase trail from front
      if (this.dead && this.trailArray[0]) {
        trailPiece = this.trailArray.pop()
        ctx.clearRect(trailPiece.x - 9 * scale, trailPiece.y - 9 * scale, 18 * scale, 18 * scale)

        if (this.trailArray.length > 0) {
          trailPiece = this.trailArray[this.trailArray.length - 1]
          bmd.draw(this.trail, trailPiece.x, trailPiece.y)
        }
      }

      if (!this.killTrail && (this.trailArray.length >= (this.lastTrailLength + this.growth))) {
        this.killTrail = true
        this.lastTrailLength = this.trailArray.length
      }

      // erase trail from behind
      if (this.killTrail && this.trailArray[0]) {
        var nRemove = 1
        if (this.shrink) {
          if (this.trailArray.length <= this.shrinkSize) {
            this.shrink = false
          } else {
            nRemove = 4
          }
        }
        for (var i = 0; i < nRemove && this.trailArray.length > 0; i++) {
          trailPiece = this.trailArray.shift()
          ctx.clearRect(trailPiece.x - 9 * scale, trailPiece.y - 9 * scale, 18 * scale, 18 * scale)
        }

        if (this.trailArray.length > 0) {
          bmd.draw(this.trail, this.trailArray[0].x, this.trailArray[0].y)
        }
      }

      // Border's collisions
      if ((xx + colisionMargin * scale) <= borders[0]) {
        this.sprite.x = borders[1] - Math.cos(this.sprite.rotation) * 30 * scale
      } else if ((xx - colisionMargin * scale) >= borders[1]) {
        this.sprite.x = borders[0] - Math.cos(this.sprite.rotation) * 30 * scale
      }

      if ((yy + colisionMargin * scale) <= borders[2]) {
        this.sprite.y = borders[3] - Math.sin(this.sprite.rotation) * 30 * scale
      } else if ((yy - colisionMargin * scale) >= borders[3]) {
        this.sprite.y = borders[2] - Math.sin(this.sprite.rotation) * 30 * scale
      }
    }
  },

  keyPressed: function () {
    if (!this.dead && this.keyUpVar) {
      this.keyUpVar = false
      if (this.direction === 1 && !gameOver && !paused) {
        this.direction = -1
        this.sprite.height *= -1
        this.distance = this.maxDistance
      } else if (!gameOver && !paused) {
        this.sprite.height *= -1
        this.direction = 1
        this.distance = this.maxDistance
      }
      this.game.add.tween(tempLabel).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true)
      this.game.add.tween(tempLabelText).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true)
    }
  },

  keyUp: function () {
    this.keyUpVar = true
  },

  click: function () {
    var x1 = w2 - 81
    var x2 = w2 + 81
    var y1 = h2 - 81
    var y2 = h2 + 81

    if (!(this.game.input.position.x > x1 &&
      this.game.input.position.x < x2 &&
      this.game.input.position.y > y1 &&
      this.game.input.position.y < y2)) {
      this.keyPressed()
    }
  },

  kill: function (player, other) {
    if (!this.dead) {
      var deathScore = parseInt(localStorage.getItem('deathScore'), 10)
      if (isNaN(deathScore)) {
        deathScore = 0
      }
      localStorage.setItem('deathScore', deathScore + 1)

      this.sprite.destroy()
      if (!mute) {
        killSound.play()
      }
      this.dead = true
    }

    if (other) {
      other.destroy()
    }
  },

  collect: function (player, power) {
    if (this.collectSemaphore === 0) {
      this.collectSemaphore = 1
      if (!mute) {
        collectSound.play()
      }
      if (power.name === 'old_point') {
        this.killTrail = false
        this.growth = 60 * power.scale.x
        this.score = this.score + power.scale.x
      }
      this.mode.collect(player, power, this)
      this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function () { this.collectSemaphore = 0 }, this)
      // because we are using overlap, this function is called two times, so we need a delay
    }
  },

  pause: function () {
    if (this.mode.submitScore) {
      this.mode.submitScore()
    }
    if (this.textTween) {
      this.textTween.pause()
    }
  },

  clearInput: function () {
    this.game.input.keyboard.removeKey(this.key)
  }

}
