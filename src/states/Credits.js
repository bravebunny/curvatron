/* global ButtonList, w2, h2, Phaser, musicList */
var credits = function (game) {
  this.title = null
  this.buttons = null
  this.containerScrollBar = null
  this.scrollMask = null
  this.containerX = 0
  this.containerY = 0
  this.items = null
  this.type = false
  this.disabledCount = 0
}

credits.prototype = {
  init: function (type) {
    this.type = type
  },

  create: function () {
    this.title = this.game.add.text(w2, 100, 'credits', {
      font: '150px dosis',
      fill: '#ffffff',
      align: 'center'
    })
    this.title.anchor.setTo(0.5, 0.5)

    this.containerX = 1.7 * w2
    this.containerY = 300

    this.buttons = new ButtonList(this, this.game)
    this.buttons.distance = 80
    var backButton = this.buttons.add('back_button', 'back', this.backPressed)
    backButton.h = 70

    this.getCreditsText()

    this.game.input.mouse.mouseWheelCallback = this.mouseWheel.bind(this)
  },

  getCreditsText: function () {
    var creds = []

    this.addDiv('GAME DEVELOPMENT AND DESIGN')
    this.addCred('Ricardo Lopes', 'https://twitter.com/Raicuparta', creds)
    this.addCred('Tiago Silva', 'https://twitter.com/JeronimoPie', creds)

    this.addDiv('DEVELOPMENT ADVISING AND WISDOM PROVIDING')
    this.addCred('Francisco Dias', 'https://twitter.com/xicombd', creds)

    this.addDiv('SOUND EFFECTS')
    this.addCred('StumpyStrust: snake movement', 'http://opengameart.org/content/ui-sounds', creds)
    this.addCred('David Lin: everything else', 'http://google.com', creds)

    this.addDiv('MUSIC')
    for (var i = 0; i < musicList.length; i++) {
      var title = musicList[i].title + " : " + musicList[i].author
      if (!title) title = 'level ' + (i + 1);
      (function (i) {
        var button = this.buttons.add(null, title, function () {
          var greenworks = require('./greenworks')
          greenworks.activateGameOverlayToWebPage(musicList[i].site) // link for the musicians pages
        })
        button.w = 550
        button.h = 70
        button.textOnly = true
      }.bind(this))(i)
    }

    this.addDiv('DANK ANDROID TRAILER')
    this.addCred('Pedro Mota', 'https://www.youtube.com/user/pnamota/videos', creds)

    this.addDiv('BETA TESTING')
    this.addCred('B-Man99', 'http://chainreactionmusic.com/', creds)
    this.addCred('LPChip', 'http://www.lpchip.nl/', creds)
    this.addCred('Beatriz Santos', null, creds)
    this.addCred('Francisco Dias', null, creds)
    this.addCred('Pedro Mota', null, creds)
    this.addCred('sergiocornaga', 'http://sergiocornaga.tumblr.com/', creds)
    this.addCred('/r/gamedev', 'https://www.reddit.com/r/gamedev/comments/41ejwm/wanna_help_me_test_my_level_editor_steam_keys_to/', creds)
    this.addCred('Stabyourself forum', 'http://forum.stabyourself.net/viewtopic.php?f=11&t=4886', creds)

    this.addDiv('SNAKES USED FOR PHYSICS TESTS')
    this.addCred('Solid', null, creds)
    this.addCred('Nagini', null, creds)
    this.addCred('Nokia 3310', null, creds)
    this.addCred('Ekans', null, creds)

    this.addDiv('No snakes were harmed in the development of this game')

    for (var i = 0; i < creds.length; i++) {
      creds[i].w = 550
      creds[i].h = 70
      creds[i].textOnly = true
    }

    this.createButtons()
  },

  addDiv: function (name) {
    var div = this.buttons.add(null, name)
    div.w = 700
    div.h = 70
    div.disable()
    this.disabledCount++
  },

  addCred: function (name, url, creds) {
    creds.push(this.buttons.add(null, name, function () {
      if (url) {
        var greenworks = require('./greenworks')
        greenworks.activateGameOverlayToWebPage(url)
      }
    }))
  },

  createButtons: function () {
    this.buttons.create()
    this.buttons.setScrolling(true)
    this.buttons.select(1)

    var barHeight = 2 * h2 - this.containerY + 100
    var draggyHeight = Math.min(barHeight * (7 / (musicList.length + 1)), barHeight)

    this.containerScrollBar = this.game.add.sprite(this.containerX, this.containerY - 100, 'scroll_button')
    this.containerScrollBar.scale.set(50, draggyHeight)
    this.containerScrollBar.anchor.set(1, 0)
    if (draggyHeight === barHeight) this.containerScrollBar.visible = false

    this.scrollMask = this.game.add.graphics(0, 0)
    this.scrollMask.beginFill(0xffffff)
    this.scrollMask.drawRect(w2 * 0.5, this.containerY - 100, w2 * 2, h2 * 2)
    this.scrollMask.endFill()

    this.buttons.setMask(this.scrollMask)

    this.containerScrollBar.inputEnabled = true
    this.containerScrollBar.input.useHandCursor = true
    this.containerScrollBar.input.enableDrag(false, true)
    this.containerScrollBar.input.allowHorizontalDrag = false
    this.containerScrollBar.input.boundsRect = new Phaser.Rectangle(
      0,
      this.containerY - 100,
      2 * w2,
      barHeight)
  },

  update: function () {
    if (this.containerScrollBar) {
      var length = this.buttons.length() + 1 + this.disabledCount
      this.buttons.setY(300 + (this.containerY - 100 - this.containerScrollBar.y) / ((2 * h2 - this.containerY + 100) / ((length) * this.buttons.distance)))
      this.buttons.update()
    }
  },

  backPressed: function () {
    this.game.state.start('Menu')
  },

  mouseWheel: function (event) {
    var min = 200, max = 900
    var c = this.containerScrollBar
    c.y -= this.game.input.mouse.wheelDelta * 10
    c.input.checkBoundsRect()
  },

  up: function () {
    this.buttons.selectUp()
    if (this.buttons.length() > 6) {
      if (this.buttons.selection < this.buttons.length() - 1) {
        if (this.containerScrollBar.y > this.containerY - 100) {
          this.buttons.setY(this.buttons.y + this.buttons.distance)
          var length = this.buttons.length() + 1 + this.disabledCount
          this.containerScrollBar.y = -(this.buttons.y - 300) * ((2 * h2 - this.containerY + 100) / ((length) * this.buttons.distance)) + this.containerY - 100
        }
      } else {
        this.buttons.setY(this.buttons.y + this.buttons.distance * this.buttons.length)
        this.containerScrollBar.y = h2 * 2 - this.containerScrollBar.height
      }
    }
  },

  down: function () {
    if (this.buttons.length() > 6) {
      if (this.buttons.selection < this.buttons.length() - 1  + this.disabledCount) {
        if (this.containerScrollBar.y < h2 * 2 - this.containerScrollBar.height) {
          this.buttons.setY(this.buttons.y - this.buttons.distance)
          var length = this.buttons.length() + 1 + this.disabledCount
          this.containerScrollBar.y = -(this.buttons.y - 300) * ((2 * h2 - this.containerY + 100) / ((length) * this.buttons.distance)) + this.containerY - 100
        }
      } else {
        this.buttons.setY(this.buttons.y - this.buttons.distance * this.buttons.length)
        this.containerScrollBar.y = this.containerY - 100
      }
    }
    this.buttons.selectDown()
  },

  selectPress: function () {
    this.buttons.selectPress()
  },

  selectRelease: function () {
    this.buttons.selectRelease()
  }

}
