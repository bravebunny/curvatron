/* global localStorage, ButtonList w2 */
var stats = function (game) {
  this.game = game
  this.buttons = null
}

stats.prototype = {
  create: function () {
    this.title = this.game.add.text(w2, 100, 'stats', {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.title.anchor.setTo(0.5, 0.5)

    var hs = localStorage.getItem('highScore')
    if (!hs) hs = 0

    var ss = localStorage.getItem('survivalScore')
    if (!ss) ss = 0

    var bs = localStorage.getItem('ballsScore')
    if (!bs) bs = 0

    var ds = localStorage.getItem('deathScore')
    if (!ds) ds = 0

    this.buttons = new ButtonList(this, this.game)
    var back = this.buttons.add('back_button', 'back', this.backPressed)
    this.buttons.add('collecting_button', 'classic best: ' + hs)
    this.buttons.add('endless_button', 'evergrowing best: ' + ss)
    this.buttons.add('deaths-stats', 'total deaths: ' + ds)
    this.buttons.add('total-stats', 'total points: ' + bs)

    this.buttons.create()
    //this.buttons.setTextSize(30)
    //back.setTextSize(60)
    this.buttons.select(0)
  },

  update: function () {
    this.buttons.update()
  },

  up: function () {
    this.buttons.selectUp()
  },

  down: function () {
    this.buttons.selectDown()
  },

  selectPress: function () {
    this.buttons.selectPress()
  },

  selectRelease: function () {
    this.buttons.selectRelease()
  },

  backPressed: function () {
    this.game.state.start('Menu')
  }

}
