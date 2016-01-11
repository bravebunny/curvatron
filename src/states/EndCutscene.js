var endCutscene = function (game) {
  this.game = game
  this.pics = []
  this.text = []
  this.delay = 1000
  this.duration = 3000
}

endCutscene.prototype = {
  preload: function () {
    this.game.load.image('end1', 'assets/sprites/game/singleplayer/adventure/end1.jpg')
    this.game.load.image('end2', 'assets/sprites/game/singleplayer/adventure/end2.jpg')
    this.game.load.image('end3', 'assets/sprites/game/singleplayer/adventure/end3.jpg')
  },

  create: function () {
    //this.scale.setResizeCallback(this.resize, this)

    this.pics[0] = this.game.add.sprite(0, 0, 'end1')
    this.pics[0].alpha = 0
    this.pics[1] = this.game.add.sprite(0, 0, 'end2')
    this.pics[1].alpha = 0
    this.pics[2] = this.game.add.sprite(0, 0, 'end3')
    this.pics[2].alpha = 0

    var tween = this.game.add.tween(this.pics[0])
    tween.to({alpha:1}, this.duration, Phaser.Easing.Linear.None).delay(this.delay)
    tween.onComplete.add(function () {
      this.addText(100, 100, this.next1,
        'After collecting all the point pellets, the snake moved to New Zealand.')
    }, this)
    tween.start()

    if (!muteMusic) {
      this.music = new buzz.sound('assets/music/soundtrack/geometry.ogg')
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
    this.addText(100, 200, this.next2,
      'It dreamed of getting a law degree there and becoming a lawyer.')
  },

  next2: function () {
    this.addText(100, 300, this.next3,
      'But life doesn\'t always work out the way we want it to...')
  },

  next3: function () {
    this.pics[1].bringToTop()
    var tween = this.game.add.tween(this.pics[1])
    tween.to({alpha:1}, this.duration, Phaser.Easing.Linear.None).delay(this.delay*3)
    tween.onComplete.add(function () {
      this.addText(100, 100, this.next4,
        'The snake met the love of its life, Bob, and they got married.')
    }, this)
    tween.start()
  },

  next4: function () {
    this.addText(100, 200, this.next5,
      'They had a daughter, and the snake had to put the law degree on hold.')
  },

  next5: function () {
    this.addText(100, 300, this.next6,
      'But one day Bob left with a curvier snake, and never came back.')
  },

  next6: function () {
    this.pics[2].bringToTop()
    var tween = this.game.add.tween(this.pics[2])
    tween.to({alpha:1}, this.duration, Phaser.Easing.Linear.None).delay(this.delay*3)
    tween.onComplete.add(function () {
      this.addText(100, 100, this.next7,
        'Now, the snake supports her child by working as a cashier at a local grocery store.')
    }, this)
    tween.start()
  },

  next7: function () {
    this.addText(100, 200, this.next8,
      'Some times, she still thinks about her old days as a point pellet collector...')
  },

  next8: function () {
    var overlay = this.game.add.sprite(0, 0, 'overlay')
    overlay.width = this.pics[0].width
    overlay.height = this.pics[0].height
    overlay.alpha = 0
    var fadeOut = this.game.add.tween(overlay)
    fadeOut.to({alpha:1}, this.duration, Phaser.Easing.Linear.None).delay(this.delay*3)
    fadeOut.onComplete.add(function () {
      this.addText(100, 100, this.next9,
        '| You can\'t tackle all your problems straight on.')
    }, this)
    fadeOut.start()
  },

  next9: function () {
    this.addText(100, 150, this.next10,
      '| Some times, you have to curve your way around them.')
  },

  next10: function () {
    this.addText(100, 225, this.next11,
      '- Albert Einstein')
  },

  next11: function () {
    this.addText(100, 400, this.next12,
      '| You have unlocked the Hard Mode levels')
  },

  next12: function () {
    this.addText(100, 475, this.next13,
      '- Mahatma Gandhi')
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
      this.state.start('Menu')
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