/*eslint-disable*/
/* global players, baseW, baseH, Phaser, setScreenFixed, colorHex, bmd:true,
  w2:true, h2:true, powerText:true, localStorage, PowerUp, nextBallHigh:true,
  scale, gameover:true, ButtonList, musicList, Vertical, Horizontal, Rotator,
  muteMusic, restarting:true, Checkpoint, finishSound, muteSoundEffects, savedCheckpoint
  changeBGColor, achievement
*/
/*eslint-enable*/
var Adventure = function (game, testing, items) {
  this.sp = true
  this.game = game
  this.spawnPowers = true
  this.countPoints = true
  this.map = null
  this.layer = null
  this.powerText = null
  this.name = 'adventure'
  this.items = items
  this.index = null
  this.margin = 400
  this.workshopLevel = false

  this.image = null
  this.albumText = null
  this.albumDeleted = false
  this.albumBg = null
  this.music = null
  this.albumCreated = false
  this.showAlbum = true
  this.site = null
  this.nowPlaying = null

  this.scale = 1
  this.defaults = {
    mapW: 60,
    mapH: 34,
    length: 60 * 34
  }
  this.mapW = 60
  this.mapH = 34
  this.tileSize = 32

  this.file = null
  this.title = 'adventure'

  this.testing = testing
  this.restarting = false
  this.levelComplete = false

  this.values = {
    start: 35,
    rotator: 34,
    horizontal: 33,
    vertical: 32,
    checkpoint: 31,
    wall: 1,
    empty: 0
  }
}

Adventure.prototype = {
  preload: function () {
    this.game.load.text('level', this.level)
    if (!this.testing && this.index !== null) {
      var music = musicList[this.index]
      this.game.load.image('cover_image', 'assets/music/covers/' + music.file + '.png')
      //this.game.load.audio('level_music', 'assets/music/soundtrack/' + music.file + '.ogg')
    }
  },

  create: function () {
    // varialbes that need to be reset on startup
    if (savedCheckpoint.score) this.score = savedCheckpoint.score
    else this.score = 0
    this.pointPositions = []
    this.player = players[0]
    this.obstacles = []

    this.albumDeleted = false
    this.albumCreated = false
    this.levelComplete = false
    this.showAlbum = true

    w2 = this.game.width / 2
    h2 = this.game.height / 2

    players[0].x = w2
    players[0].y = h2

    this.powerText = this.game.add.text(0, 0, '1', {
      font: '20px dosis',
      fill: colorHex,
      align: 'center'
    })
    this.powerText.anchor.setTo(0.5, 0.5)

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
        var worldX = x * this.tileSize + this.tileSize / 2
        var worldY = y * this.tileSize + this.tileSize / 2
        var val = parseInt(levelArray[x * this.mapH + y], 36)

        if (val === this.values.wall) this.map.putTile(0, x, y)
        else if (val === this.values.start) {
          players[0].x = worldX
          players[0].y = worldY + 5
        } else if (val === this.values.vertical) {
          var vert = new Vertical(this.game, worldX, worldY)
          vert.create()
          this.obstacles.push(vert)
        } else if (val === this.values.horizontal) {
          var hor = new Horizontal(this.game, worldX, worldY)
          hor.create()
          this.obstacles.push(hor)
        } else if (val === this.values.rotator) {
          var rot = new Rotator(this.game, worldX, worldY)
          rot.create()
          this.obstacles.push(rot)
        } else if (val === this.values.checkpoint) {
          var check = new Checkpoint(this.game, this, worldX, worldY)
          check.create()
          this.obstacles.push(check)
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

    this.finishButtons = new ButtonList(this, this.game)
    this.finishButtons.add('restart_button', 'restart', this.backPressed)
    this.finishButtons.add('steam_button', 'workshop page', this.showWorkshop)
    this.finishButtons.create()
    this.finishButtons.centerVertically()
    this.finishButtons.hide()

    if (!this.testing) {
      var music = musicList[this.index]
      if (this.music == null && this.index !== null) {
        this.music = new buzz.sound('assets/music/soundtrack/' + music.file + '.ogg')
        var volume = 50
        if (music.volume) volume *= music.volume
        this.music.setVolume(volume)
      } 
      if (this.music && !muteMusic) {
        if (!this.music.isPlaying) {
          this.music.play()
          this.music.loop()
        }
      } else if (this.music) this.music.stop()
    }
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
    if (!this.testing) {
      if (/*this.music.isPlaying && */this.showAlbum) {
        this.showAlbum = false
        if (!muteMusic) {
          if (!this.restarting && this.index !== null) this.createAlbumElements()
          this.restarting = true
        }
      }
    }

    if (!this.albumDeleted && !this.testing && this.albumCreated) {
      this.deleteAlbumElements()
    }
    if (this.game.physics.arcade.collide(players[0].sprite, this.layer)) {
      players[0].kill()
    }
    var obs = this.obstacles
    for (var i = 0; i < obs.length; i++) obs[i].update()
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
      this.player.dead = true
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
      if (!muteSoundEffects) finishSound.play()
      this.levelComplete = true
      var manager = this.game.state.states['GameMananger']
      manager.shareText.setText('level completed')
      manager.shareText.visible = true
      manager.endGame()
      manager.twitterButton.enable()
      if (!this.file) {
        var unlocks = localStorage.getItem('unlocks')
        if (unlocks === null) unlocks = 0
        else unlocks = parseInt(unlocks, 10)
        if (unlocks < this.index + 1) localStorage.setItem('unlocks', this.index + 1)
        if (localStorage.getItem('unlocks') > this.index) manager.nextButton.enable()
        if (localStorage.getItem('unlocks') > 30) this.adventureEnd()
       }
    }
  },

  adventureEnd: function () {
    achievement('adventure_end')
    this.game.state.start('EndCutscene')
  },

  playNextLevel: function () {
    achievement('level_progress')
    changeBGColor(this.game)
    this.index++
    this.restarting = false
    this.level = 'assets/levels/' + this.items[this.index]
    console.log(this.level)
    this.music.stop()
    this.music = null
    this.game.cache.removeText('level')
    this.game.state.restart()
  },

  createAlbumElements: function () {
    this.albumCreated = true
    var album = musicList[this.index]
    var title = album.title
    var author = album.author
    var site = album.site

    this.albumBg = this.game.add.sprite(0, 0, 'overlay')
    this.albumBg.anchor.setTo(0, 0.5)
    this.albumBg.fixedToCamera = true
    this.albumBg.cameraOffset.setTo(80, h2 * 4)
    this.albumBg.width = w2 * 1.0
    this.albumBg.height = 1.8 * h2
    this.albumBg.alpha = 0.4

    this.nowPlaying = this.game.add.text(0, 0, 'Now Playing:', {
      font: '70px dosis',
      fill: '#ffffff'})
    this.nowPlaying.scale.set(scale * 0.7)
    this.nowPlaying.anchor.setTo(0, 0.5)
    this.nowPlaying.fixedToCamera = true
    this.nowPlaying.cameraOffset.setTo(100, h2 * 2.5)

    var text = title + '\n' + author
    this.image = this.game.add.sprite(0, 0, 'cover_image') // [hard-coded] probably we need to change the coordinates
    this.image.anchor.setTo(0, 0.5)
    this.image.fixedToCamera = true
    this.image.cameraOffset.setTo(100, h2 * 2.5)
    this.image.scale.set(0.7)
    this.image.alpha = 0.9

    this.albumText = this.game.add.text(0, 0, text, {
      font: '60px dosis',
      fill: '#ffffff'})
    this.albumText.scale.set(scale * 0.7)
    this.albumText.anchor.setTo(0, 0.5)
    this.albumText.fixedToCamera = true
    this.albumText.cameraOffset.setTo(130 + this.image.width, h2 * 2.5)

    this.site = this.game.add.text(0, 0, site, {
      font: '50px dosis',
      fill: '#ffffff'})
    this.site.scale.set(scale * 0.7)
    this.site.anchor.setTo(0, 0.5)
    this.site.fixedToCamera = true
    this.site.cameraOffset.setTo(130 + this.image.width, h2 * 2.5)

    if (this.albumText.width > this.site.width) {
      this.albumBg.width = this.albumText.width + this.image.width + 75
    } else {
      this.albumBg.width = this.site.width + this.image.width + 75
    }

    this.game.add.tween(this.nowPlaying.cameraOffset).to({ y: h2 * 1.57 }, 1100, Phaser.Easing.Sinusoidal.In, true)
    this.game.add.tween(this.image.cameraOffset).to({ y: h2 * 1.80 }, 1000, Phaser.Easing.Sinusoidal.In, true)
    this.game.add.tween(this.albumText.cameraOffset).to({ y: h2 * 1.75 }, 1000, Phaser.Easing.Sinusoidal.In, true)
    this.game.add.tween(this.albumBg.cameraOffset).to({ y: h2 * 2.40 }, 1100, Phaser.Easing.Sinusoidal.In, true)
    this.game.add.tween(this.site.cameraOffset).to({ y: h2 * 1.90 }, 1100, Phaser.Easing.Sinusoidal.In, true)
  },

  deleteAlbumElements: function () {
    this.albumDeleted = true
    this.game.time.events.add(Phaser.Timer.SECOND * 5, function () {
      this.game.add.tween(this.image.cameraOffset).to({ y: h2 * 2.5 }, 1000, Phaser.Easing.Sinusoidal.In, true)
      this.game.add.tween(this.nowPlaying.cameraOffset).to({ y: h2 * 4 }, 1000, Phaser.Easing.Sinusoidal.In, true)
      this.game.add.tween(this.albumBg.cameraOffset).to({ y: h2 * 4 }, 1000, Phaser.Easing.Sinusoidal.In, true)
      this.game.add.tween(this.site.cameraOffset).to({ y: h2 * 4 }, 1000, Phaser.Easing.Sinusoidal.In, true)
      var aux = this.game.add.tween(this.albumText.cameraOffset).to({ y: h2 * 2.5 }, 1000, Phaser.Easing.Sinusoidal.In, true)
      aux.onComplete.add(function () {
        this.image.kill
        this.albumText.kill
      }, this)
    }, this)
  }

}
