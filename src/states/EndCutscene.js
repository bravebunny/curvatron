var endCutscene = function (game) {
  this.game = game
  this.pics = []
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
    this.pics[1] = this.game.add.sprite(0, 0, 'end2')
    this.pics[2] = this.game.add.sprite(0, 0, 'end3')

    this.resize()
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