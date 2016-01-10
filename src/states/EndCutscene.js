var endCutscene = function (game) {
  this.game = game
  this.pics = []
  this.text = []
}

endCutscene.prototype = {
  preload: function () {
    this.game.load.image('end1', 'assets/sprites/game/singleplayer/adventure/end1.jpg')
    this.game.load.image('end2', 'assets/sprites/game/singleplayer/adventure/end2.jpg')
    this.game.load.image('end3', 'assets/sprites/game/singleplayer/adventure/end3.jpg')
  },

  create: function () {
    this.scale.setResizeCallback(this.resize, this)

    this.pics[0] = this.game.add.sprite(0, 0, 'end1')
    this.pics[0].alpha = 0
    this.pics[1] = this.game.add.sprite(0, 0, 'end2')
    this.pics[1].alpha = 0
    this.pics[2] = this.game.add.sprite(0, 0, 'end3')
    this.pics[2].alpha = 0

    var tween = this.game.add.tween(this.pics[0])
    tween.to({alpha:1}, 2000, Phaser.Easing.Linear.None).delay(500)
    tween.onComplete.add(function () {
      this.addText(100, 100, this.next1,
        'After collecting all the point pellets, the snake moved to New Zealand.')
    }, this)
    tween.start()

    this.resize()
  },

  addText: function (x, y, next, words) {
    var text = this.add.text(x, y + 50, words, {
      font: '50px tinos',
      fill: '#ffffff',
      align: 'left',
    })
    text.setShadow(-3, 3, 'rgba(0,0,0,0.8)', 5)
    text.fixedToCamera = true
    text.alpha = 0

    var move = this.game.add.tween(text.cameraOffset)
    console.log(text.y)
    move.to({y: y}, 2000, Phaser.Easing.Quadratic.Out).delay(500)
    move.start()

    var fadeIn = this.game.add.tween(text)
    fadeIn.to({alpha:1}, 2000, Phaser.Easing.Linear.None).delay(500)
    fadeIn.onComplete.add(next, this)
    fadeIn.start()

  },

  next1: function () {
    this.addText(100, 200, this.next2,
      'It dreamed of getting a law degree there and becoming a lawyer.')
  },

  next2: function () {

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