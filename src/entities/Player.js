/*eslint-disable*/
/* global scale, w2, h2, groupPowers, borders, paused, Phaser
  totalTime, bmd, colisionMargin, gameOver, tempLabel, tempLabelText,
  pauseSprite, localStorage, muteMusic, killSound, collectSound, players,
  colorPlayers, moveSounds, muteSoundEffects:true, pauseTween:true, lerp, countdown,
  savedCheckpoint
*/
/*eslint-enable*/
var Player = function (id, x, y, key, mode, game) {
  this.game = game
  this.mode = mode
  this.sprite = null
  this.score = 0
  this.direction = 1
  this.id = id
  this.x = x
  this.y = y
  this.key = key
  this.dead = false
  this.ready = false
  this.speed = 1
  this.angularVelocity = 1
  this.growth = 40
  this.initialSize = 60
  this.size = this.initialSize
  this.frameCount = 0
  this.keyText = null
  this.paused = false
  this.textTween = null
  this.trailArray = []
  this.showKeyTime = 0
  this.showOneKey = true
  this.shrink = false
  this.shrinkAmount = 200
  this.collectSemaphore = 0
  this.eatenPoint = null
  this.finished = false

  this.inputTimes = []
  this.autoMode = false
  this.totalTime = 0
  this.keyUpVar = true
}

Player.prototype = {
  create: function () {
    if (savedCheckpoint.savedSize) {
      this.size = savedCheckpoint.savedSize
      this.x = savedCheckpoint.position.x
      this.y = savedCheckpoint.position.y
    }
    this.graphics = this.game.add.graphics(0, 0)

    var spriteName = 'player'
    if (!this.mode.sp) spriteName += this.id

    this.sprite = this.game.add.sprite(this.x, this.y, spriteName)
    this.sprite.name = '' + this.id

    this.sprite.anchor.setTo(0.5, 0.5)

    // used to do this in a fancier way, but it broke some stuff
    if (this.y > h2 && !this.mode.sp) {
      this.sprite.rotation = Math.PI
    }

    if (!this.mode.sp) {
      this.color = Phaser.Color.hexToColor(colorPlayers[this.id])
    } else {
      this.color = Phaser.Color.hexToColor('#FFFFFF')
    }

    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE)
    this.sprite.scale.set(scale)
    // this.sprite.body.setSize(20,20,0,0)

    this.sprite.body.angularVelocity = this.direction * 200 * this.angularVelocity * this.speed * scale

    this.game.input.onDown.dispose()
    this.game.input.onUp.dispose()
    this.game.input.keyboard.onDownCallback = null
    this.game.input.keyboard.onUpCallback = null
    this.game.input.gamepad.onDownCallback = null
    this.game.input.gamepad.onUpCallback = null
    if (this.mode.sp) {
      this.game.input.onDown.add(this.keyPressed, this)
      this.game.input.onUp.add(this.keyUp, this)
      this.game.input.keyboard.addCallbacks(this, this.keyPressed, this.keyUp)
      this.game.input.gamepad.onDownCallback = this.keyPressed.bind(this)
      this.game.input.gamepad.onUpCallback = this.keyUp.bind(this)
    } else {
      if (this.key.indexOf(',') !== -1) { // this means it is a controller button
        var gamepad = parseInt(this.key.split(',')[0], 10)
        var button = parseInt(this.key.split(',')[1], 10)
        this.input = this.game.input.gamepad['pad' + gamepad].getButton(button).onDown.add(this.keyPressed, this)
      } else {
        this.input = this.game.input.keyboard.addKey(this.key).onDown.add(this.keyPressed, this)
      }
    }
    this.showKey()
  // this.moveRandom()
  },

  update: function () {
    if (!this.paused && paused) {
      this.paused = true
      this.pause()
    } else if (this.paused && !paused) {
      this.paused = false
      this.unpause()
    }

    if (this.showKeyTime <= totalTime && !this.dead && !paused) {
      this.showKey()
    }

    if (!this.paused) {
      this.totalTime += this.game.time.physicsElapsedMS
      if (this.autoMode && (this.totalTime) >= this.inputTimes[0]) {
        this.inputTimes.shift()
        // this.keyPressed()
      }

      var ctx = bmd.ctx
      // erase trail from front
      if (!this.finished && this.dead && this.frameCount === 0 && this.trailArray[0]) {
        var trailEnd = this.trailArray.pop()
        ctx.clearRect(trailEnd.x - 10 * scale, trailEnd.y - 10 * scale, 20 * scale, 20 * scale)
      }
      var trail = this.trailArray
      if (trail.length > 1) {
        if (this.mode.sp) {
          ctx.strokeStyle = '#FFFFFF'
        } else {
          ctx.strokeStyle = colorPlayers[this.id]
        }
        ctx.lineWidth = 16 * scale
        ctx.lineCap = 'round'

        var len = trail.length
        var distance = Math.sqrt(Math.pow(trail[len - 2].x - trail[len - 1].x, 2) + Math.pow(trail[len - 2].y - trail[len - 1].y, 2))

        if (distance < 100) {
          ctx.beginPath()
          ctx.moveTo(trail[len - 2].x, trail[len - 2].y)
          ctx.lineTo(trail[len - 1].x, trail[len - 1].y)
          ctx.stroke()
        }
      }
      if (!this.sprite.alive) {
        this.kill()
      }

      var xx = Math.cos(this.sprite.rotation) * 30 * scale + this.sprite.x
      var yy = Math.sin(this.sprite.rotation) * 30 * scale + this.sprite.y

      // make the last eaten point follow the player
      if (this.eatenPoint !== null && !this.finished) {
        var point = this.eatenPoint
        var x = lerp(xx, point.x, 0.85)
        var y = lerp(yy, point.y, 0.85)
        this.eatenPoint.position.setTo(x, y)

        if (this.game.physics.arcade.distanceBetween(this.eatenPoint, this.sprite) <= 1) {
          this.eatenPoint = null
        }
      }

      xx = Math.cos(this.sprite.rotation) * 18 * scale + this.sprite.x
      yy = Math.sin(this.sprite.rotation) * 18 * scale + this.sprite.y

      // player movement
      this.game.physics.arcade.velocityFromAngle(this.sprite.angle, 300 * this.speed * scale, this.sprite.body.velocity)
      this.sprite.body.angularVelocity = this.direction * 200 * this.angularVelocity * this.speed
      this.frameCount = (this.frameCount + 1) % 1 / (this.speed * scale)

      if (!this.dead) {
        // Add to trail
        if (this.frameCount === 0 && !this.dead && this.sprite.alpha > 0) {
          var trailPiece = {'x': this.sprite.x, 'y': this.sprite.y, 'n': 1}
          this.trailArray.push(trailPiece)
        // bmd.draw(this.trail, this.sprite.x, this.sprite.y)
        }

        // collision detection
        if (!this.mode.noCollisions) {
          var collSize = 12 * scale
          for (var i = 0; i < players.length; i++) {
            for (var j = 0; j < this.trailArray.length; j++) {
              var curTrail = players[i].trailArray[j]
              if (curTrail && curTrail.x - collSize < xx && curTrail.x + collSize > xx &&
                curTrail.y - collSize < yy && curTrail.y + collSize > yy) {
                achievement('cannibal')
                this.kill()
              }
            }
          }
        }
      } else if (this.trailArray.length > 1) {
        // move the head backwards when dead
        this.sprite.position.set(this.trailArray[len - 1].x, this.trailArray[len - 1].y)
      } else if (this.sprite !== null) {
        this.sprite.kill()
      }

      this.game.physics.arcade.overlap(this.sprite, groupPowers, this.collect, null, this)

      if (this.mode.obstacleGroup) {
        if (this.game.physics.arcade.overlap(this.sprite, this.mode.obstacleGroup, this.kill, null, this)) {
        }
      }

      for (i = 0; i < players.length; i++) {
        if (i !== this.id) {
          this.game.physics.arcade.overlap(this.sprite, players[i].sprite, this.kill, null, this)
          this.game.physics.arcade.overlap(this.sprite, players[i].sprite, this.achievementHead, null, this)
        }
      }

      trailPiece = null
      ctx = bmd.context

      // erase trail from behind
      if (this.trailArray.length >= this.size && this.frameCount === 0 && this.trailArray[0] || this.dead || this.finished) {
        if (this.mode.erasesTrail() || this.dead) {
          var nRemove = 1
          if (this.shrink) {
            if (this.trailArray.length <= this.size) {
              this.shrink = false
            } else {
              nRemove = 4
            }
          }
          for (i = 0; i < nRemove && this.trailArray.length > 0; i++) {
            trailPiece = this.trailArray.shift()
            ctx.clearRect(trailPiece.x - 10 * scale, trailPiece.y - 10 * scale, 20 * scale, 20 * scale)
          }

        /*
        if (this.trailArray.length > 0) {
          bmd.draw(this.trail, this.trailArray[0].x, this.trailArray[0].y)
        }*/
        }
      }

      // redraw erased trail
      if (trail[1]) {
        /*
        var trailInBounds =
        trail[0].x < this.game.width &&
          trail[0].x > 0 &&
          trail[0].y < this.game.height &&
          trail[0].y > 0 */
        // if (trailInBounds) {
        if (this.mode.sp) {
          ctx.strokeStyle = '#FFFFFF'
        } else {
          ctx.strokeStyle = colorPlayers[this.id]
        }

        distance = Math.sqrt(Math.pow(trail[0].x - trail[1].x, 2) + Math.pow(trail[0].y - trail[1].y, 2))

        if (distance < 100) {
          ctx.beginPath()
          ctx.moveTo(trail[0].x, trail[0].y)
          ctx.lineTo(trail[1].x, trail[1].y)
          ctx.stroke()
        }

        // }
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

  keyUp: function () {
    this.keyUpVar = true
  },

  keyPressed: function () {
    if (!countdown && this.keyUpVar) {
      if (!this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
        this.ready = true
        if (this.mode.sp) this.keyUpVar = false
        else {
          this.showOneKey = true
          this.showKeyTime = 2 + totalTime
        }
        if (!this.dead && !gameOver && !paused) {
          if (this.autoMode) console.log(this.totalTime)
          else this.inputTimes.push(this.totalTime)
          if (this.direction === 1) {
            this.direction = -1
            if (!muteSoundEffects && !paused) {
              moveSounds[0].play()
            }
          } else {
            this.direction = 1
            if (!muteSoundEffects) {
              moveSounds[1].play()
            }
          }
          if (!this.mode.sp && this.keyText.alpha === 1) {
            this.textTween = this.game.add.tween(this.keyText).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true)
          }
          if (tempLabel !== null && tempLabel.alpha === 0.7) {
            this.game.add.tween(tempLabel).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true)
            this.game.add.tween(tempLabelText).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true)
          }
        }
      }
      // needed for replay system, but causes tail flickering. disabled for now.
      // if (this.sprite.body) this.update()
    }
  },

  kill: function (player, other) {
    if (this.keyText) this.keyText.destroy()
    if (!this.dead && !this.finished) {
      if (this.mode.sp) {
        var deathScore = parseInt(localStorage.getItem('deathScore'), 10)
        if (isNaN(deathScore)) {
          deathScore = 0
        }
        localStorage.setItem('deathScore', deathScore + 1)
      }
      if (this.mode.sp || (!player && !other)) {
        // this.sprite.kill()
        this.dead = true
      }

      if (!muteSoundEffects && !this.mode.levelComplete) {
        killSound.play()
      }

      if (this.mode.kill) {
        this.mode.kill()
      }
    }

    if (other && !this.mode.sp) {
      var thisPlayer = players[parseInt(player.name, 10)]
      var otherPlayer = players[parseInt(other.name, 10)]
      if (thisPlayer.score >= otherPlayer.score) {
        otherPlayer.kill()
      }
      if (thisPlayer.score <= otherPlayer.score) {
        thisPlayer.kill()
      }
    }
  },

  collect: function (player, power) {
    if (this.collectSemaphore === 0) {
      this.collectSemaphore = 1
      if (!muteSoundEffects) {
        collectSound.play()
      }

      if (this.mode.collect) {
        this.mode.collect(player, power, this)
      }

      this.eatenPoint = power
      var scaleTo = 0
      var duration = 300
      if (this.finished) {
        scaleTo = 1.5
        duration = 100
      }

      // this.game.add.tween(power).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true)
      var powerTween = this.game.add.tween(power.scale).to({x: scaleTo, y: scaleTo}, duration, Phaser.Easing.Linear.None, true)
      powerTween.onComplete.add(function () {
        if (!this.finished) {
          power.destroy()
          this.collectSemaphore = 0
        }
      }, this)
    }
  },

  showKey: function () {
    // Show player's key
    if (!this.mode.sp && this.showOneKey) {
      var keyX = Math.round(Math.cos(this.sprite.rotation + Math.PI / 2 * this.direction) * 88 * scale) + this.sprite.x
      var keyY = Math.round(Math.sin(this.sprite.rotation + Math.PI / 2 * this.direction) * 88 * scale) + this.sprite.y
      this.showOneKey = false
      if (this.keyText) {
        this.textTween = this.game.add.tween(this.keyText).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true)
        this.keyText.x = keyX
        this.keyText.y = keyY
      } else {
        this.keyText = this.game.add.text(keyX, keyY, String.fromCharCode(this.key), {
          font: '60px dosis',
          fill: '#ffffff',
          align: 'center'})
        this.keyText.scale.set(scale)
        this.keyText.anchor.setTo(0.5, 0.5)
      }
    }
  },

  addCrown: function () {
    this.sprite.loadTexture('crown' + this.id)
  },

  removeCrown: function () {
    this.sprite.loadTexture('player' + this.id)
  },

  pause: function () {
    if (this.game.input.gamepad.justPressed(Phaser.Gamepad.XBOX360_START) && this.mode.sp) {
      this.direction *= -1
    }
    if (this.mode.submitScore) {
      this.mode.submitScore()
    }
    if (this.textTween) {
      this.textTween.pause()
    }
    this.sprite.body.angularVelocity = 0
    this.sprite.body.velocity.x = 0
    this.sprite.body.velocity.y = 0
  },

  unpause: function () {
    if (this.textTween) {
      this.textTween.resume()
    }
    this.sprite.body.angularVelocity = this.direction * 200 * this.angularVelocity * this.speed * scale
  },

  // demo stuff
  moveRandom: function () {
    if (this.randomTimer == null) {
      this.randomTimer = this.game.time.create(false)
      this.randomTimer.start()
    }
    this.randomTimer.add(Phaser.Timer.SECOND * this.game.rnd.realInRange(0.2, 1.5), this.moveRandom, this)
    this.keyPressed()
  },

  clearInput: function () {
    this.game.input.keyboard.removeKey(this.key)
  },

  setInputTimes: function (times) {
    this.autoMode = true
    this.inputTimes = times
  },

  achievementHead: function () {
    achievement('mp_head')
  },

  render: function () {
    this.game.debug.body(this.sprite)
  }

}
