var gameMananger = function (game) {
  this.gameTime = 60 // sec
  this.initialTime = 0
  this.powerTimer = null
  this.ui = {}
  this.mode = null
  colisionMargin = 20
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

    /*pauseSprite = this.add.button(2*w2 - 100, 100, 'pauseButton', this.touchPauseButton, this)
  	pauseSprite.anchor.setTo(0.5, 0.5)
  	pauseSprite.input.useHandCursor = true
  	pauseSprite.scale.set(0.5)

  	if (!this.mode.sp) {
    	pauseSprite.position.set(w2, h2)
    	pauseSprite.scale.set(0.8)
    }*/

    // create BitmapData
    bmd = this.add.bitmapData(this.game.width, this.game.height)
    bmd.addToWorld()
    bmd.smoothed = false

    var angle = 0
    if (mobile && this.orientation === 'portrait') {
      angle = Math.PI / 2
    }

    // Choose snake locations
    var nPlayers = 0
    if (this.mode.nPlayers) {
      nPlayers = this.mode.nPlayers
    }
    for (var i = 0; i <= nPlayers; i++) {
      players[i] = new Player(i,
        Math.cos((2 * Math.PI / (nPlayers + 1)) * i - angle) * (w2 - 200) + w2,
        Math.sin((2 * Math.PI / (nPlayers + 1)) * i - angle) * (h2 - 100) + h2,
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

    for (var i = 0; i <= nPlayers; i++) {
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

  },

  update: function () {
    if (!paused) {
      if (menuMusic.isPlaying && (menuMusic.volume === 1) && !gameOver && !mute) {
        menuMusic.fadeOut(2000)
      }
      totalTime += this.game.time.physicsElapsed

      /*if(!this.mode.gridIsFull()){
      	this.mode.createPower("point")
      	this.mode.createObstacle()
      }*/

      if (!gameOver) {
        // Give crown
        if (this.mode.update) {
          this.mode.update()
        }
        if (this.mode.sp && players[0].dead) {
          this.endGame()
        }

      }
    } else {
      menuUpdate()
    }

    // Update players
    /*var ctx = bmd.ctx
    bmd.dirty = true
    ctx.clearRect(0, 0, bmd.canvas.width, bmd.canvas.height);*/
    for (var i = 0; i < players.length; i++) {
      players[i].update()
    }
  },

  createPower: function () {
    if (this.mode.createPower) {
      this.mode.createPower('point')
    }
  },

  endGame: function () {
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

      var restartButton = this.add.button(w2 + 97, h2 - 97, 'restart_button')

      restartButton.scale.set(1, 1)
      restartButton.anchor.setTo(0.5, 0.5)
      restartButton.input.useHandCursor = true
      clickButton(restartButton, this.restart, this)

      var mainMenu = this.add.button(w2 - 97, h2 - 97, 'exit_button')
      mainMenu.scale.set(1, 1)
      mainMenu.anchor.setTo(0.5, 0.5)
      mainMenu.input.useHandCursor = true
      clickButton(mainMenu, function () {this.state.start('Menu');}, this)

      if (mobile) {
        pauseSprite.alpha = 0
        pauseSprite.input.useHandCursor = false
      }

      if (this.mode.sp) {
        var spAuxLabel = this.add.sprite(w2, h2 + 77, 'aux-stat')
        spAuxLabel.scale.set(0.9, 0.9)
        spAuxLabel.anchor.setTo(0.5, 0.5)
        spAuxLabel.alpha = 0.7

        var spScoreLabel = this.add.sprite(w2, h2 + 217, 'score-stat')
        spScoreLabel.scale.set(0.6, 0.6)
        spScoreLabel.anchor.setTo(0.5, 0.5)
        spScoreLabel.alpha = 0.7
        if (mobile) {
          spScoreLabel.x = w2 - 60
        }

        var textCurrentScore = this.add.text(w2, h2 + 77, this.mode.getScore().toString(), {
          font: '90px dosis',
          fill: colorHexDark,
          align: 'center'
        })

        if (this.mode.submitScore) {
          this.mode.submitScore()
        }

        var textHighScore = this.add.text(w2 + 35, h2 + 220, this.mode.getHighScore().toString(), {
          font: '40px dosis',
          fill: colorHexDark,
          align: 'center'
        })

        if (mobile) {
          textHighScore.x = w2 + 35 - 60
        }
        textCurrentScore.anchor.setTo(0.5, 0.5)
        textHighScore.anchor.setTo(0.5, 0.5)

        if (mobile) {
          leaderboardButton = this.add.button(w2 + 105, h2 + 217, 'leaderboard_button')
          leaderboardButton.scale.set(0.6, 0.6)
          leaderboardButton.anchor.setTo(0.5, 0.5)
          leaderboardButton.input.useHandCursor = true
          clickButton(leaderboardButton, this.leaderboard, this)
        }
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

      menuArray = []

      menuArray[0] = new Button(w2, 300, 'resume_button', 'resume', 0, this.backPressed, this, this.game)
      menuArray[0].create()

      menuArray[1] = new Button(w2, 425, 'restart_button', 'restart', 1, this.restart, this, this.game)
      menuArray[1].create()

      menuArray[2] = new Button(w2, 550, 'exit_button', 'exit', 2, function () { this.state.start('Menu') }, this, this.game)
      menuArray[2].create()

      if (mute) {
        menuArray[3] = new Button(w2, 675, 'audiooff_button', 'unmute', 3, this.muteSound, this, this.game)
        menuArray[3].create()
      } else {
        menuArray[3] = new Button(w2, 675, 'audio_button', 'mute', 3, this.muteSound, this, this.game)
        menuArray[3].create()
      }

      menuArray[0].select()

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

      ui.menu.destroy()
      ui.restart.destroy()
      ui.exit.destroy()
      ui.audioButton.destroy()
      paused = false
    }

  },

  restart: function () {
    this.state.restart(true, false, this.mode)
  },

  touchPauseButton: function () {
    if (!paused) {
      this.backPressed()
      if (mobile) {
        pauseSprite.input.useHandCursor = false
      }
    }
  },

  leaderboard: function () {
    // TODO leaderboard
  },

  muteSound: function () {
    if (mute) {
      this.ui.audioButton.loadTexture('audio_button')
      mute = false
    } else {
      this.ui.audioButton.loadTexture('audiooff_button')
      mute = true
      if (menuMusic && menuMusic.isPlaying) {
        menuMusic.stop()
      }
    }
  },

  /*render: function(){
  	players[0].render()
  },*/

  shutdown: function () {
    for (var i = 0; i < players.length; i++) {
      players[i].clearInput()
    }
  },

  renderGroup: function (member) {
    // this.game.debug.body(member)
  }

}
