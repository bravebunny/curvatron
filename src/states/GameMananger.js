/*eslint-disable*/
/* global moveSounds:true, tempLabel:true, bmd:true,
menuMusic, pauseSprite, colisionMargin, scale:true, players:true, gameOver:true,
muteAudio:true, paused:true, totalTime:true, pauseTween:true, borders:true,
colisionMargin:true, nextBallHigh:true, changeColor:true, killSound:true,
collectSound:true, Phaser, w2, h2, groupPowers:true, tempLabelText:true,
colorHex, Player, keys, colorHexDark, bgColor:true, mute:true, ButtonList,
clickButton, localStorage, saveAs, countdown:true, Screenshot */
/*eslint-enable*/
var gameMananger = function (game) {
  tempLabel = null
  this.gameTime = 60 // sec
  this.initialTime = 0
  this.powerTimer = null
  this.ui = {}
  this.mode = null
  colisionMargin = 20
  countdown = false
  this.pauseButtons = null
  this.rToken = null
  this.rTokenSecret = null
  this.countdownCounter = 3
  this.countdownText = 0
  this.screenshot = null
}

gameMananger.prototype = {
  init: function (mode) {
    this.mode = mode
  },

  create: function () {
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

    if (this.mode.setColors) this.mode.setColors()

    groupPowers = this.add.group()
    if (this.mode.sp && this.mode.getHighScore) {
      countdown = false
      tempLabel = this.add.sprite(w2, h2, 'score')
      tempLabel.anchor.setTo(0.5, 0.5)
      tempLabel.alpha = 0.7
      tempLabelText = this.add.text(w2 + 50, h2 + 8, this.mode.getHighScore().toString(), {
        font: '75px dosis',
        fill: colorHex,
        align: 'center'
      })
      tempLabelText.anchor.setTo(0.5, 0.5)
    } else if (!this.mode.sp) {
      countdown = true
      ui.graphics.lineStyle(0)
      ui.graphics.beginFill(0x000000, 0.2)
      ui.timeCircle = ui.graphics.drawCircle(w2, h2, Math.sqrt(w2 * w2 + h2 * h2) * 2)
      ui.timeCircle.pivot.x = w2
      ui.timeCircle.pivot.y = h2
      ui.graphics.endFill()

      if (!this.mode.sp) {
        // Generate powers
        this.powerTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.mode.createPower, this.mode)
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

    this.screenshot = new Screenshot(this.game)
    if (this.mode.name === 'creative') this.screenshot.tweetMessage = 'I made art with #Curvatron'
    else if (this.mode.name === 'adventure') {
      var title = this.mode.title.substring(0, 100)
      this.screenshot.tweetMessage = 'I beat the level \"' + title + '\" in #Curvatron !'
    } else {
      this.screenshot.tweetMessage = 'Can you beat my score in the ' + this.mode.name + ' mode of #Curvatron ?'
    }

    // Choose snake locations
    var nPlayers = 0
    if (this.mode.nPlayers) {
      nPlayers = this.mode.nPlayers
    }
    for (var i = 0; i <= nPlayers; i++) {
      players[i] = new Player(i,
        Math.cos((2 * Math.PI / (nPlayers + 1)) * i + Math.PI) * (w2 - 200) + w2,
        Math.sin((2 * Math.PI / (nPlayers + 1)) * i + Math.PI) * (h2 - 100) + h2,
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

    for (i = 0; i <= nPlayers; i++) {
      players[i].create()
    }

    if (this.mode.setCamera) this.mode.setCamera()
    borders = [0, this.game.world.width, 0, this.game.world.height]

    // create BitmapData
    bmd = this.add.bitmapData(this.game.world.width, this.game.world.height)
    bmd.addToWorld()
    bmd.smoothed = false

    ui.overlay = this.add.button(0, 0, 'overlay', function () {
      if (gameOver && !this.shareButtons.visible) {
        this.restart()
      }
    }, this)
    ui.overlay.scale.set(0)
    ui.overlay.alpha = 0.5
    ui.overlay.fixedToCamera = true

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

    this.shareButtons = new ButtonList(this, this.game)
    this.shareButtons.add('twitter_button', 'send tweet', this.screenshot.share.bind(this.screenshot))
    this.shareButtons.add('cancel_button', 'cancel', this.cancelShare)
    this.shareButtons.textColor = colorHexDark
    this.shareButtons.create()
    this.shareButtons.hide()

    this.shareText = this.add.text(w2, 150, '', {
      font: '80px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.shareText.anchor.setTo(0.5, 0.5)
    this.shareText.visible = false
    this.shareText.fixedToCamera = true

    this.pauseButtons = new ButtonList(this, this.game)
    this.pauseButtons.add('resume_button', 'resume', this.backPressed)
    if (this.mode.name === 'creative') {
      this.pauseButtons.add('twitter_button', 'share picture', this.share)
      this.pauseButtons.add('screenshot_button', 'save picture', this.screenshot.save.bind(this.screenshot))
    }
    this.pauseButtons.add('restart_button', 'restart', this.restart)
    this.ui.audioButton = this.pauseButtons.add(audioButton, audioText, this.muteSound)
    if (this.mode.file) {
      this.pauseButtons.add('steam_button', 'workshop page', this.showWorkshop)
    }
    if (this.mode.testing) {
      this.pauseButtons.add('back_button', 'editor', function () { this.state.start('Editor', true, false, true, this.mode.scale) })
    } else {
      this.pauseButtons.add('exit_button', 'exit', function () { this.state.start('Menu') })
    }
    this.pauseButtons.textColor = colorHexDark
    this.pauseButtons.create()
    this.pauseButtons.hide()

    this.deathButtons = new ButtonList(this, this.game)
    this.deathButtons.add('restart_button', 'restart', this.restart)
    if (this.mode.items) {
      this.nextButton = this.deathButtons.add('resume_button', 'next level', this.mode.playNextLevel.bind(this.mode))
      var unlocks = localStorage.getItem('unlocks')
      if (unlocks === null) unlocks = 0
      else unlocks = parseInt(unlocks, 10)
      if (unlocks <= this.mode.index) this.nextButton.disable()
    }
    if (this.mode.getScore) {
      if (this.mode.file) this.twitterButton = this.deathButtons.add('twitter_button', 'share', this.share)
      else this.twitterButton = this.deathButtons.add('twitter_button', 'share score', this.share)
      this.deathButtons.add('screenshot_button', 'save picture', this.screenshot.save.bind(this.screenshot))
    }
    if (this.mode.testing) {
      this.deathButtons.add('back_button', 'editor', function () { this.state.start('Editor', true, false, true, this.mode.scale) })
    } else if (this.mode.file) {
      this.deathButtons.add('exit_button', 'more levels', function () { this.state.start('LevelSelector', true, false, 'workshop levels') })
    } else {
      this.deathButtons.add('exit_button', 'exit', function () { this.state.start('Menu') })
    }
    this.deathButtons.textColor = colorHexDark
    this.deathButtons.create()
    if (this.mode.name === 'adventure') this.twitterButton.disable()
    this.deathButtons.hide()

    if (!this.mode.sp) {
      this.countdownCounter = 3
      this.countdownText = this.game.add.text(w2, h2, '3', {
        font: '175px dosis',
        fill: '#ffffff',
        align: 'center' })
      this.countdownText.anchor.setTo(0.5, 0.5)
      this.game.time.events.loop(Phaser.Timer.SECOND, this.updateCountdown, this)
    }

    this.rotator = new Rotator(this.game, 600, 600)
    this.rotator.create()
  },

  update: function () {
    this.rotator.update()
    this.game.forceSingleUpdate = true
    if (!paused) {
      if (menuMusic && menuMusic.isPlaying && (menuMusic.volume === 1) && !gameOver && !mute) {
        menuMusic.fadeOut(2000)
      }
      if (!countdown) {
        totalTime += this.game.time.physicsElapsed
      }
      /* for testing point placement
      if(!this.mode.gridIsFull()){
        this.mode.createPower("point")
        this.mode.createObstacle()
      } */

      if (!gameOver) {
        if (this.game.canvas.style.cursor !== 'none') {
          this.game.canvas.style.cursor = 'none'
        }
        // Give crown
        if (this.mode.update) {
          this.mode.update()
        }
        if (this.mode.sp && players[0].dead) {
          this.endGame()
        }
      } else {
        this.deathButtons.update()
        this.shareButtons.update()
      }
      this.countdownText.alpha = 1
    } else {
      this.countdownText.alpha = 0
      this.pauseButtons.update()
      if (this.mode.name === 'creative') this.shareButtons.update()
    }

    // Update players
    /*
    var ctx = bmd.ctx
    bmd.dirty = true
    ctx.clearRect(0, 0, bmd.canvas.width, bmd.canvas.height) */
    for (var i = 0; i < players.length; i++) {
      players[i].update()
    }

    this.screenshot.update()
    if (this.screenshot.tweeting) {
      this.shareText.visible = true
      this.shareText.setText('sending tweet...')
      this.screenshot.tweeting = false
      this.shareButtons.disable()
    }
    if (this.screenshot.tweetSuccess !== 0) {
      if (this.screenshot.tweetSuccess === 1) {
        this.shareText.setText('tweet sent successfully!')
      } else if (this.screenshot.tweetSuccess === -1) {
        this.shareText.setText('connection error')
      }
      this.cancelShare()
      this.screenshot.tweetSuccess = 0
      this.shareButtons.enable()
    }
    if (this.screenshot.popup && !this.screenshot.popup.top) {
      this.screenshot.popup = null
      this.shareText.visible = false
      this.shareButtons.enable()
    }
  },

  updateCountdown: function () {
    if (!paused) {
      this.countdownCounter--
      this.countdownText.setText(this.countdownCounter)
      if (this.countdownCounter === 0) {
        this.countdownText.setText('go')
        countdown = false
      }
      if (this.countdownCounter === -1) {
        this.countdownText.kill()
      }
    }
  },

  endGame: function () {
    if (this.mode.getScore) {
      if (this.mode.name !== 'adventure') {
        var ssLabel = this.add.sprite(w2, h2, 'aux-stat')
        ssLabel.scale.set(0.9, 0.9)
        ssLabel.anchor.setTo(0.5, 0.5)
        ssLabel.alpha = 0.5

        var ssText = this.add.text(w2, h2 - 10, this.mode.getScore().toString(), {
          font: '90px dosis',
          fill: colorHex,
          align: 'center'
        })
        ssText.anchor.setTo(0.5, 0.5)
        ssText.alpha = 0.7

        if (this.mode.name) {
          var modeName = this.add.text(w2, h2 + 45, this.mode.name, {
            font: '40px dosis',
            fill: colorHex,
            align: 'center'
          })
          modeName.anchor.setTo(0.5, 0.5)
          modeName.alpha = 0.5
        }
      }

      this.screenshot.snap()

      if (ssLabel) ssLabel.kill()
      if (ssText) ssText.kill()
      if (modeName) modeName.kill()
    }

    var ui = this.ui
    if (!gameOver) {
      var bottomY = this.deathButtons.getButton(this.deathButtons.length() - 1).y
      if (this.mode.endGame) {
        this.mode.endGame(bottomY)
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
      if (this.game.canvas.style.cursor !== 'auto') {
        this.game.canvas.style.cursor = 'auto'
      }
      this.deathButtons.select(0)

      if (this.mode.sp && this.mode.getHighScore) {
        var spAuxLabel = this.add.sprite(w2, bottomY + 150, 'aux-stat')
        spAuxLabel.scale.set(0.9, 0.9)
        spAuxLabel.anchor.setTo(0.5, 0.5)
        spAuxLabel.alpha = 0.7

        var spScoreLabel = this.add.sprite(w2, bottomY + 300, 'score-stat')
        spScoreLabel.scale.set(0.6, 0.6)
        spScoreLabel.anchor.setTo(0.5, 0.5)
        spScoreLabel.alpha = 0.7

        var textCurrentScore = this.add.text(w2, bottomY + 150, this.mode.getScore().toString(), {
          font: '90px dosis',
          fill: colorHexDark,
          align: 'center'
        })

        if (this.mode.submitScore) {
          this.mode.submitScore()
        }

        var textHighScore = this.add.text(w2 + 35, bottomY + 303, this.mode.getHighScore().toString(), {
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
    if (this.shareButtons.enabled && this.shareButtons.visible) {
      this.cancelShare()
      return
    }

    var ui = this.ui
    if (!paused && !this.game.input.gamepad.justPressed(Phaser.Gamepad.XBOX360_B)) { // pause
      if (this.mode.name === 'creative') this.screenshot.snap()
      this.game.tweens.pauseAll()
      if (this.mode.pause) {
        this.mode.pause()
      }

      if (gameOver) {
        if (this.mode.testing) {
          this.state.start('Editor', true, false, true, this.mode.scale)
        } else {
          this.state.start('Menu')
        }
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
      if (this.game.canvas.style.cursor !== 'auto') {
        this.game.canvas.style.cursor = 'auto'
      }
      this.pauseButtons.select(0)
    } else { // unpause
      this.game.tweens.resumeAll()
      ui.overlay.scale.set(0)

      if (this.mode.unPause) {
        this.mode.unPause()
      }

      if (!this.mode.sp) {
        this.powerTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.mode.createPower, this.mode)
      }

      ui.overlay.inputEnabled = true

      this.pauseButtons.hide()
      this.shareText.visible = false
      paused = false
    }
  },

  restart: function () {
    if (this.mode.setScreen) {
      this.mode.setScreen()
    }
    this.state.restart(true, false, this.mode)
  },

  share: function () {
    if (this.mode.name === 'creative') this.pauseButtons.hide()
    else this.deathButtons.hide()
    this.shareButtons.show()
    this.shareButtons.select(1)
  },

  cancelShare: function () {
    if (this.mode.name === 'creative') this.pauseButtons.show()
    else this.deathButtons.show()
    this.shareButtons.hide()
    if (this.game.canvas.style.cursor !== 'auto') {
      this.game.canvas.style.cursor = 'auto'
    }
  },

  touchPauseButton: function () {
    if (!paused) {
      this.backPressed()
    }
  },

  showWorkshop: function () {
    if (this.mode.file) {
      var greenworks = require('./greenworks')
      greenworks.ugcShowOverlay(this.mode.file)
    }
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
    }
    localStorage.setItem('mute', mute)
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
    this.pauseButtons.selectUp()
    this.deathButtons.selectUp()
    this.shareButtons.selectUp()
  },

  down: function () {
    this.pauseButtons.selectDown()
    this.deathButtons.selectDown()
    this.shareButtons.selectDown()
  },

  selectPress: function () {
    this.pauseButtons.selectPress()
    this.deathButtons.selectPress()
    this.shareButtons.selectPress()
  },

  selectRelease: function () {
    this.pauseButtons.selectRelease()
    this.deathButtons.selectRelease()
    this.shareButtons.selectRelease()
  },

  render: function () {
    /*
    if (this.game.camera.deadzone) {
      var zone = this.game.camera.deadzone

      this.game.context.fillStyle = 'rgba(255,255,255,0.2)'
      this.game.context.fillRect(zone.x, zone.y, zone.width, zone.height)

      this.game.debug.cameraInfo(this.game.camera, 32, 32)
      this.game.debug.spriteCoords(players[0].sprite, 32, 500)
    }*/
  }

}
