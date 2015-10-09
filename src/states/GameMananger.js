/*eslint-disable*/
/* global leaderboardButton:true, moveSounds:true, tempLabel:true, bmd:true,
menuMusic, pauseSprite, colisionMargin, scale:true, players:true, gameOver:true,
muteAudio:true, paused:true, totalTime:true, pauseTween:true, borders:true,
colisionMargin:true, nextBallHigh:true, changeColor:true, killSound:true,
collectSound:true, Phaser, w2, h2, groupPowers:true, tempLabelText:true,
colorHex, Player, keys, colorHexDark, bgColor:true, mute:true, ButtonList,
clickButton, localStorage */
/*eslint-enable*/
var gameMananger = function (game) {
  this.gameTime = 60 // sec
  this.initialTime = 0
  this.powerTimer = null
  this.ui = {}
  this.mode = null
  colisionMargin = 20
  this.pauseButtons = null
  this.popup = null
  this.twitter = null
  this.rToken = null
  this.rTokenSecret = null
}

gameMananger.prototype = {
  init: function (mode) {
    this.mode = mode
  },

  create: function () {
    this.orientation = Math.abs(window.orientation) - 90 === 0 ? 'landscape' : 'portrait'
    scale = 1
    if (!this.mode.sp) {
      scale = (-1 / 24) * this.mode.nPlayers + 7 / 12
    }

    players = []
    gameOver = false
    muteAudio = false
    paused = false
    totalTime = 0
    pauseTween = null
    borders = [0, this.game.world.width, 0, this.game.world.height]
    bmd = null
    nextBallHigh = 0

    changeColor = true

    // create sound effects
    moveSounds = []
    moveSounds[0] = this.add.audio('move0')
    moveSounds[1] = this.add.audio('move1')
    killSound = this.add.audio('kill')

    collectSound = this.add.audio('sfx_collect0')

    this.initialTime = this.game.time.totalElapsedSeconds()

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 0

    var ui = this.ui
    ui.graphics = this.add.graphics(w2, h2)

    groupPowers = this.add.group()
    if (this.mode.sp) {
      if (this.mode.leaderboardID) {
        tempLabel = this.add.sprite(w2, h2, 'score')
        tempLabel.anchor.setTo(0.5, 0.5)
        tempLabel.alpha = 0.7
        tempLabelText = this.add.text(w2 + 50, h2 + 8, this.mode.getHighScore().toString(), {
          font: '100px dosis',
          fill: colorHex,
          align: 'center'
        })
        tempLabelText.anchor.setTo(0.5, 0.5)
      }
    } else {
      ui.graphics.lineStyle(0)
      ui.graphics.beginFill(0x000000, 0.2)
      ui.timeCircle = ui.graphics.drawCircle(w2, h2, Math.sqrt(w2 * w2 + h2 * h2) * 2)
      ui.timeCircle.pivot.x = w2
      ui.timeCircle.pivot.y = h2
      ui.graphics.endFill()

      if (!this.mode.sp) {
        // Generate powers
        this.powerTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.createPower, this)
      }
    }

    /*
    pauseSprite = this.add.button(2*w2 - 100, 100, 'pauseButton', this.touchPauseButton, this)
    pauseSprite.anchor.setTo(0.5, 0.5)
    pauseSprite.input.useHandCursor = true
    pauseSprite.scale.set(0.5)

    if (!this.mode.sp) {
      pauseSprite.position.set(w2, h2)
      pauseSprite.scale.set(0.8)
    }
    */

    // create BitmapData
    bmd = this.add.bitmapData(this.game.width, this.game.height)
    bmd.addToWorld()
    bmd.smoothed = false

    // Choose snake locations
    var nPlayers = 0
    if (this.mode.nPlayers) {
      nPlayers = this.mode.nPlayers
    }
    for (var i = 0; i <= nPlayers; i++) {
      players[i] = new Player(i,
        Math.cos((2 * Math.PI / (nPlayers + 1)) * i) * (w2 - 200) + w2,
        Math.sin((2 * Math.PI / (nPlayers + 1)) * i) * (h2 - 100) + h2,
        keys[i], this.mode, this.game)
    }

    if (this.mode.create) {
      this.mode.create(this)
    }

    if (this.mode.sp) {
      this.game.stage.backgroundColor = colorHex
      document.body.style.background = colorHexDark
      bgColor = Phaser.Color.hexToColor(colorHex)
    } else {
      this.game.stage.backgroundColor = colorHexDark
      bgColor = Phaser.Color.hexToColor(colorHexDark)
    }

    if (this.mode.spawnPowers) {
      this.createPower()
    }

    for (i = 0; i <= nPlayers; i++) {
      players[i].create()
    }

    ui.overlay = this.add.button(0, 0, 'overlay', function () {
      if (gameOver) {
        this.restart()
      }
    }, this)
    ui.overlay.scale.set(0)
    ui.overlay.alpha = 0.5

    if (!mute) {
      menuMusic.volume = 1
    }

    var audioButton, audioText
    if (mute) {
      audioButton = 'audiooff_button'
      audioText = 'audio: off'
    } else {
      audioButton = 'audio_button'
      audioText = 'audio: on'
    }

    this.pauseButtons = new ButtonList(this, this.game)
    this.pauseButtons.add('resume_button', 'resume', this.backPressed)
    this.pauseButtons.add('restart_button', 'restart', this.restart)
    this.ui.audioButton = this.pauseButtons.add(audioButton, audioText, this.muteSound)
    this.pauseButtons.add('exit_button', 'exit', function () { this.state.start('Menu') })
    this.pauseButtons.textColor = colorHexDark
    this.pauseButtons.create()
    this.pauseButtons.hide()

    this.deathButtons = new ButtonList(this, this.game)
    this.deathButtons.add('restart_button', 'restart', this.restart)
    this.deathButtons.add('twitter_button', 'share score', this.share)
    this.deathButtons.add('exit_button', 'exit', function () { this.state.start('Menu') })
    this.deathButtons.textColor = colorHexDark
    this.deathButtons.create()
    this.deathButtons.hide()
  },

  update: function () {
    if (!paused) {
      if (menuMusic && menuMusic.isPlaying && (menuMusic.volume === 1) && !gameOver && !mute) {
        menuMusic.fadeOut(2000)
      }
      totalTime += this.game.time.physicsElapsed

      /* for testing point placement
      if(!this.mode.gridIsFull()){
        this.mode.createPower("point")
        this.mode.createObstacle()
      } */

      if (!gameOver) {
        // Give crown
        if (this.mode.update) {
          this.mode.update()
        }
        if (this.mode.sp && players[0].dead) {
          this.endGame()
        }
      } else {
        this.deathButtons.update()
      }
    } else {
      this.pauseButtons.update()
    }

    // Update players
    /*
    var ctx = bmd.ctx
    bmd.dirty = true
    ctx.clearRect(0, 0, bmd.canvas.width, bmd.canvas.height) */
    for (var i = 0; i < players.length; i++) {
      players[i].update()
    }

    if (this.popup !== null && this.popup.location.href.split('oauth_verifier=')[1] !== undefined) {
      this.tweetUpdate()
    }
  },

  createPower: function () {
    if (this.mode.createPower) {
      this.mode.createPower('point')
    }
  },

  endGame: function () {
    var png = this.game.canvas.toDataURL()
    this.png = png.replace(/^data:image\/png;base64,/, '')

    var ui = this.ui
    if (!gameOver) {
      if (this.mode.endGame) {
        this.mode.endGame()
      }

      if (!mute) {
        menuMusic.play()
        menuMusic.volume = 1
      }
      ui.overlay.inputEnabled = false
      if (this.mode.sp) {
        this.game.time.events.add(Phaser.Timer.SECOND * 1, function () {
          ui.overlay.inputEnabled = true
        }, this)
      }

      ui.overlay.width = w2 * 2
      ui.overlay.height = h2 * 2
      if (!this.mode.sp) {
        this.game.time.events.remove(this.powerTimer)
        this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.restart, this)
      }

      this.deathButtons.show()
      this.deathButtons.select(0)

      if (this.mode.sp) {
        var spAuxLabel = this.add.sprite(w2, h2 + 100, 'aux-stat')
        spAuxLabel.scale.set(0.9, 0.9)
        spAuxLabel.anchor.setTo(0.5, 0.5)
        spAuxLabel.alpha = 0.7

        var spScoreLabel = this.add.sprite(w2, h2 + 250, 'score-stat')
        spScoreLabel.scale.set(0.6, 0.6)
        spScoreLabel.anchor.setTo(0.5, 0.5)
        spScoreLabel.alpha = 0.7

        var textCurrentScore = this.add.text(w2, h2 + 100, this.mode.getScore().toString(), {
          font: '90px dosis',
          fill: colorHexDark,
          align: 'center'
        })

        if (this.mode.submitScore) {
          this.mode.submitScore()
        }

        var textHighScore = this.add.text(w2 + 35, h2 + 253, this.mode.getHighScore().toString(), {
          font: '40px dosis',
          fill: colorHexDark,
          align: 'center'
        })

        textCurrentScore.anchor.setTo(0.5, 0.5)
        textHighScore.anchor.setTo(0.5, 0.5)
      }
      gameOver = true
    }
  },

  backPressed: function () {
    var ui = this.ui
    if (!paused) { // pause
      this.game.tweens.pauseAll()
      if (this.mode.pause) {
        this.mode.pause()
      }

      if (gameOver) {
        this.state.start('Menu')
      }
      ui.overlay.width = w2 * 2
      ui.overlay.height = h2 * 2

      if (pauseTween) {
        pauseTween.stop()
      }
      paused = true
      ui.overlay.inputEnabled = false

      if (!this.mode.sp) {
        this.game.time.events.remove(this.powerTimer)
      }

      this.pauseButtons.show()
      this.pauseButtons.select(0)
    } else { // unpause
      this.game.tweens.resumeAll()
      ui.overlay.scale.set(0)

      if (this.mode.unPause) {
        this.mode.unPause()
      }

      if (!this.mode.sp) {
        this.powerTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.createPower, this)
      }

      ui.overlay.inputEnabled = true

      this.pauseButtons.hide()
      paused = false
    }
  },

  restart: function () {
    this.state.restart(true, false, this.mode)
  },

  touchPauseButton: function () {
    if (!paused) {
      this.backPressed()
    }
  },

  leaderboard: function () {
    // TODO leaderboard
  },

  muteSound: function () {
    if (mute) {
      this.ui.audioButton.setIcon('audio_button')
      this.ui.audioButton.setText('audio: on ')
      mute = false
    } else {
      this.ui.audioButton.setIcon('audiooff_button')
      this.ui.audioButton.setText('audio: off')
      mute = true
      if (menuMusic && menuMusic.isPlaying) {
        menuMusic.stop()
      }
      localStorage.setItem('mute', mute)
    }
  },

  /*
  render: function(){
    players[0].render()
  }, */

  shutdown: function () {
    for (var i = 0; i < players.length; i++) {
      players[i].clearInput()
    }
  },

  up: function () {
    if (paused) this.pauseButtons.selectUp()
    else if (gameOver) this.deathButtons.selectUp()
  },

  down: function () {
    if (paused) this.pauseButtons.selectDown()
    else if (gameOver) this.deathButtons.selectDown()
  },

  selectPress: function () {
    if (paused) this.pauseButtons.selectPress()
    else if (gameOver) this.deathButtons.selectPress()
  },

  selectRelease: function () {
    if (paused) this.pauseButtons.selectRelease()
    else if (gameOver) this.deathButtons.selectRelease()
  },

  share: function () {
    /*
		this.game.canvas.toBlob(function(blob) {
      //saveAs(blob, "creative.png")
    });
		*/

    var TwitterAPI = require('node-twitter-api')
    this.twitter = new TwitterAPI({
      consumerKey: 'NwssUgdW5A1dKhtzExUFc5AtQ',
      consumerSecret: 'S4yhhvUDPKAEI4Wqwx9TCqLaQgsdcB8FjhPG6GyMLVK1xzgqeV',
      callback: 'http://bravebunny.co/'
    })

    this.twitter.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
      if (error) {
        console.log(error)
      } else {
        this.rToken = requestToken
        this.rTokenSecret = requestTokenSecret
        this.popup = window.open(this.twitter.getAuthUrl(this.rToken))
      }
    }.bind(this))
  },

  tweetUpdate: function () {
    var oauthVerifier = this.popup.location.href.split('oauth_verifier=')[1]
    this.popup.close()
    this.popup = null

    var aToken, aTokenSecret

    this.twitter.getAccessToken(this.rToken, this.rTokenSecret, oauthVerifier, function (error, accessToken, accessTokenSecret, results) {
      if (error) {
        console.log(error)
      } else {
        aToken = accessToken
        aTokenSecret = accessTokenSecret

        var params = {
          media: this.png,
          isBase64: true
        }

        this.twitter.uploadMedia(params, aToken, aTokenSecret, function (error, response) {
          if (error) console.log(error)
          else {
            this.twitter.statuses('update', {
              status: 'This is my score in #Curvatron',
              media_ids: response.media_id_string
            },
              aToken,
              aTokenSecret,
              function (error, data, response) {
                if (error) console.log(error)
              }
            )
          }
        }.bind(this))
      }
    }.bind(this))
  },

  renderGroup: function (member) {
    // this.game.debug.body(member)
  }

}
