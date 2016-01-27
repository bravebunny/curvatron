var endCutscene = function (game) {
  this.game = game
  this.pics = []
  this.text = []
  this.delay = 1000
  this.duration = 3000
  this.hard = false
  this.textLines = []
}

endCutscene.prototype = {
  init: function (hard) {
    if (hard) this.hard = true
  },

  preload: function () {
    if (this.hard) {
      this.game.load.image('end1', 'assets/sprites/game/singleplayer/adventure/end1-hard.jpg')
      this.game.load.image('end2', 'assets/sprites/game/singleplayer/adventure/end2-hard.jpg')
      this.game.load.image('end3', 'assets/sprites/game/singleplayer/adventure/end3-hard.jpg')
    } else {    
      this.game.load.image('end1', 'assets/sprites/game/singleplayer/adventure/end1.jpg')
      this.game.load.image('end2', 'assets/sprites/game/singleplayer/adventure/end2.jpg')
      this.game.load.image('end3', 'assets/sprites/game/singleplayer/adventure/end3.jpg')
    }
  },

  create: function () {
    //this.scale.setResizeCallback(this.resize, this)

    this.pics[0] = this.game.add.sprite(0, 0, 'end1')
    this.pics[0].alpha = 0
    this.pics[1] = this.game.add.sprite(0, 0, 'end2')
    this.pics[1].alpha = 0
    this.pics[2] = this.game.add.sprite(0, 0, 'end3')
    this.pics[2].alpha = 0

    if (this.hard) {
      this.textLines = [
        'The snake went to a concert to have fun after her adventure.',
        'A friend offered some point pellets and she couldn\'t resist.',
        'But these were stronger than what she was used to...',
        'The snake ended up passing out on a dirty alleyway.',
        'When she was found, it was already too late.',
        'She had overdosed on the point pellets.',
        'Nobody came to the funeral.',
        'The snake was quickly forgotten.',
        '| I doubt anyone ever got this far.',
        '| But congrats if you did.',
        '- Bob Marley',
        '| If we evolved from snakes, why do we still have snakes?',
        '- Charles Darwin'
      ]
    } else {
      this.textLines = [
        'After collecting all the point pellets, the snake moved to New Zealand.',
        'She dreamed of getting a law degree there and becoming a lawyer.',
        'But life doesn\'t always work out the way we want it to...',
        'The snake met the love of its life, Bob, and they got married.',
        'They had a daughter, and the snake had to put the law degree on hold.',
        'But one day Bob left with a curvier snake, and never came back.',
        'Now, the snake supports her child by working as a cashier at a local grocery store.',
        'Some times, she still thinks about her old days as a point pellet collector...',
        '| You can\'t tackle all your problems straight on.',
        '| Some times, you have to curve your way around them.',
        '- Albert Einstein',
        '| You have unlocked the Hard Mode levels',
        '- Mahatma Gandhi'
      ]
    }

    var tween = this.game.add.tween(this.pics[0])
    tween.to({alpha:1}, this.duration, Phaser.Easing.Linear.None).delay(this.delay)
    tween.onComplete.add(function () {
      this.addText(100, 100, this.next1,
        this.textLines[0])
    }, this)
    tween.start()

    if (!muteMusic) {
      var musicFile = this.hard ? 'inertia_jungle.ogg' : 'geometry.ogg'
      this.music = new buzz.sound('assets/music/soundtrack/' + musicFile)
      this.music.play().fadeIn()
    }

    this.resize()
  },

  addText: function (x, y, next, words) {
    var text = this.add.text(x, y + 50, words, {
      font: '50px tinos',
      fill: '#ffffff',
      align: 'left',
    })
    var maxWidth = this.world.width * 0.75
    if (text.width > maxWidth) text.width = maxWidth
    text.scale.y = text.scale.x
    text.setShadow(-3, 3, 'rgba(0,0,0,1)', 10)
    text.stroke = '#000000';
    text.strokeThickness = 1;
    text.fixedToCamera = true
    text.alpha = 0

    var move = this.game.add.tween(text.cameraOffset)
    move.to({y: y}, this.duration, Phaser.Easing.Quadratic.Out).delay(this.delay)
    move.start()

    var fadeIn = this.game.add.tween(text)
    fadeIn.to({alpha:1}, this.duration, Phaser.Easing.Linear.None).delay(this.delay)
    fadeIn.onComplete.add(next, this)
    fadeIn.start()

  },

  next1: function () {
    this.addText(100, 200, this.next2, this.textLines[1])
  },

  next2: function () {
    this.addText(100, 300, this.next3,this.textLines[2])
  },

  next3: function () {
    this.pics[1].bringToTop()
    var tween = this.game.add.tween(this.pics[1])
    tween.to({alpha:1}, this.duration, Phaser.Easing.Linear.None).delay(this.delay*3)
    tween.onComplete.add(function () {
      this.addText(100, 100, this.next4, this.textLines[3])
    }, this)
    tween.start()
  },

  next4: function () {
    this.addText(100, 200, this.next5, this.textLines[4])
  },

  next5: function () {
    this.addText(100, 300, this.next6, this.textLines[5])
  },

  next6: function () {
    this.pics[2].bringToTop()
    var tween = this.game.add.tween(this.pics[2])
    tween.to({alpha:1}, this.duration, Phaser.Easing.Linear.None).delay(this.delay*3)
    tween.onComplete.add(function () {
      this.addText(100, 100, this.next7, this.textLines[6])
    }, this)
    tween.start()
  },

  next7: function () {
    this.addText(100, 200, this.next8, this.textLines[7])
  },

  next8: function () {
    var overlay = this.game.add.sprite(0, 0, 'overlay')
    overlay.width = this.pics[0].width
    overlay.height = this.pics[0].height
    overlay.alpha = 0
    var fadeOut = this.game.add.tween(overlay)
    fadeOut.to({alpha:1}, this.duration, Phaser.Easing.Linear.None).delay(this.delay*3)
    fadeOut.onComplete.add(function () {
      this.addText(100, 100, this.next9, this.textLines[8])
    }, this)
    fadeOut.start()
  },

  next9: function () {
    this.addText(100, 150, this.next10, this.textLines[9])
  },

  next10: function () {
    this.addText(100, 225, this.next11, this.textLines[10])
  },

  next11: function () {
    this.addText(100, 400, this.next12, this.textLines[11])
  },

  next12: function () {
    this.addText(100, 475, this.next13, this.textLines[12])
  },

  next13: function () {
    if (!muteMusic) this.music.fadeOut(this.duration + this.delay*5)
    var overlay = this.game.add.sprite(0, 0, 'overlay')
    overlay.width = this.pics[0].width
    overlay.height = this.pics[0].height
    overlay.alpha = 0
    overlay.bringToTop()
    var fadeOut = this.game.add.tween(overlay)
    fadeOut.to({alpha:1}, this.duration, Phaser.Easing.Linear.None).delay(this.delay*5)
    fadeOut.onComplete.add(function () {
      if (this.music) this.music.stop()
      this.state.start('Credits', true, false, true)
    }, this)
    fadeOut.start()
  },

  resize: function () {
    adjustScreen(this.game)
    for (var i = 0; i < this.pics.length; i++) {
      var w = this.world.width
      var h = this.world.height
      var ratio = w / h
      var imgRatio = 16 / 9

      if (ratio < imgRatio) {
        this.pics[i].width = h * imgRatio
        this.pics[i].height = h
      } else {
        this.pics[i].width = w
        this.pics[i].height = w / imgRatio
      }
    }
  }
}