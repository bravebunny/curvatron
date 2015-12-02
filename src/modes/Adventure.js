/*eslint-disable*/
/* global players, baseW, baseH, Phaser, setScreenFixed, colorHex, bmd:true,
  w2:true, h2:true, powerText:true, localStorage, PowerUp, nextBallHigh:true,
  scale, gameover:true, ButtonList, musicList, Vertical, Horizontal, Rotator,
  muteMusic, restarting:true
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

  this.image = null
  this.albumText = null
  this.albumDeleted = false
  this.albumBg = null
  this.music = null
  this.albumCreated = false
  this.showAlbum = true

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
    wall: 1,
    empty: 0
  }
}

Adventure.prototype = {
  preload: function () {
    if (!this.testing) {
      var music = musicList[this.index]
      this.game.load.image('cover_image', 'assets/music/covers/' + music.file + '.png')
      this.game.load.audio('level_music', 'assets/music/soundtrack/' + music.file + '.ogg')
    }
  },

  create: function () {
    // varialbes that need to be reset on startup
    this.score = 0
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
      if (this.music == null) this.music = this.game.add.audio('level_music')
      if (!muteMusic) {
        //if (!this.restarting) this.createAlbumElements()
        //this.restarting = true
        if (!this.music.isPlaying) {
          this.music.play()
        }
      } else this.music.stop()
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
    if (this.music.isPlaying && this.showAlbum) {
      this.showAlbum = false
      if (!muteMusic) {
        if (!this.restarting) this.createAlbumElements()
        this.restarting = true
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
      }
    }
  },

  playNextLevel: function () {
    changeBGColor(this.game)
    this.index++
    this.restarting = false
    this.game.state.start('PreloadGame', true, false, this, 'assets/levels/' + this.items[this.index])
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
    this.albumBg.height = 2 * h2
    this.albumBg.alpha = 0.4

    var text = title + '\n' + author + '\n' + site
    this.image = this.game.add.sprite(0, 0, 'cover_image') // [hard-coded] probably we need to change the coordinates
    this.image.anchor.setTo(0, 0.5)
    this.image.fixedToCamera = true
    this.image.cameraOffset.setTo(100, h2 * 2.5)
    this.image.scale.set(0.8)
    this.image.alpha = 0.9

    this.albumText = this.game.add.text(0, 0, text, {
      font: '60px dosis',
      fill: '#ffffff'})
    this.albumText.scale.set(scale * 0.8)
    this.albumText.anchor.setTo(0, 0.5)
    this.albumText.fixedToCamera = true
    this.albumText.cameraOffset.setTo(130 + this.image.width, h2 * 2.5)

    this.game.add.tween(this.image.cameraOffset).to({ y: h2 * 1.75 }, 1000, Phaser.Easing.Sinusoidal.In, true)
    this.game.add.tween(this.albumText.cameraOffset).to({ y: h2 * 1.75 }, 1000, Phaser.Easing.Sinusoidal.In, true)
    this.game.add.tween(this.albumBg.cameraOffset).to({ y: h2 * 2.48 }, 1100, Phaser.Easing.Sinusoidal.In, true)
  },

  deleteAlbumElements: function () {
    this.albumDeleted = true
    this.game.time.events.add(Phaser.Timer.SECOND * 5, function () {
      this.game.add.tween(this.image.cameraOffset).to({ y: h2 * 2.5 }, 1000, Phaser.Easing.Sinusoidal.In, true)
      this.game.add.tween(this.albumBg.cameraOffset).to({ y: h2 * 4 }, 1000, Phaser.Easing.Sinusoidal.In, true)
      var aux = this.game.add.tween(this.albumText.cameraOffset).to({ y: h2 * 2.5 }, 1000, Phaser.Easing.Sinusoidal.In, true)
      aux.onComplete.add(function () {
        this.image.kill
        this.albumText.kill
      }, this)
    }, this)
  }

}
