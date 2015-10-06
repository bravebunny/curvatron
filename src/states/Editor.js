/* global setScreenFixed, baseW, baseH, Phaser, colorHexDark, Blob, saveAs
*/
var editor = function (game) {
  this.sp = true
  this.game = game
  this.layer = null
  this.marker = null
  this.map = null

  this.tool = 'draw' // 0=draw, 1=erase, 2=point
  this.selectedPoint = 1

  this.tb = {}

  this.points = []
  this.pointsGrid = []
  this.levelArray = []

  this.mapW = 80
  this.mapH = 45

  this.prevCursorX = 0
  this.prevCursorY = 0

  this.mouseWasDown = false
}

editor.prototype = {
  preload: function () {
    setScreenFixed(baseW, baseH + 200, this.game)

    this.game.load.image('point', 'assets/sprites/game/singleplayer/point.png')
    this.game.load.image('player0', 'assets/sprites/game/singleplayer/player.png')
    this.game.load.image('superPower', 'assets/sprites/game/singleplayer/powerHS.png')
    this.game.load.image('obstacle', 'assets/sprites/game/singleplayer/obstacle.png')
    this.game.load.spritesheet('shrink', 'assets/sprites/game/singleplayer/shrink.png', 100, 100)

    this.game.load.image('editorPoint', 'assets/sprites/gui/editor/point.png')
    this.game.load.image('editorDraw', 'assets/sprites/gui/editor/draw.png')
    this.game.load.image('editorErase', 'assets/sprites/gui/editor/erase.png')
    this.game.load.image('editorArrow', 'assets/sprites/gui/editor/arrow.png')
    this.game.load.image('editorStart', 'assets/sprites/gui/editor/start.png')
    this.game.load.image('editorSave', 'assets/sprites/gui/editor/save.png')
    this.game.load.image('editorNewPage', 'assets/sprites/gui/editor/newPage.png')
    this.game.load.image('editorExit', 'assets/sprites/gui/editor/exit.png')

    this.game.load.image('Pastel', 'assets/levels/Pastel.png') // loading the tileset image
    this.game.load.tilemap('level', 'assets/levels/blank.json', null, Phaser.Tilemap.TILED_JSON) // loading the tilemap file
  },

  create: function () {
    // change outer background color
    document.body.style.background = colorHexDark

    this.obstacleGroup = this.game.add.group()
    this.lastPoint = null

    this.map = this.game.add.tilemap('level') // Preloaded tilemap
    this.map.addTilesetImage('Pastel') // Preloaded tileset

    this.layer = this.map.createLayer('obstacles') // layer[0]
    this.map.setCollisionByExclusion([], true, this.layer)

    this.levelArray = Array.apply(null, Array(this.mapW * this.mapH)).map(Number.prototype.valueOf, 0)

    this.game.canvas.oncontextmenu = function (e) { e.preventDefault() }

    // toolbar background
    this.tb.bg = this.game.add.sprite(0, baseH, 'overlay')
    this.tb.bg.width = baseW
    this.tb.bg.height = 200
    this.tb.bg.alpha = 0.5

    // toolbar icons
    this.tb.left = this.game.add.button(100, baseH + 100, 'editorArrow', this.pointDec, this)
    this.tb.left.anchor.set(0.5, 0.5)
    this.tb.left.scale.set(-0.4, 0.4)

    this.tb.point = this.game.add.button(200, baseH + 100, 'editorPoint', this.pointTool, this)
    this.tb.point.anchor.set(0.5)
    this.tb.point.scale.set(0.4)

    this.tb.pointText = this.game.add.text(this.tb.point.x, this.tb.point.y, this.selectedPoint, {
      font: '60px dosis',
      fill: colorHexDark,
      align: 'center'
    })
    this.tb.pointText.anchor.set(0.5)

    // toolbar icons
    this.tb.right = this.game.add.button(300, baseH + 100, 'editorArrow', this.pointInc, this)
    this.tb.right.anchor.set(0.5, 0.5)
    this.tb.right.scale.set(0.4)

    this.tb.draw = this.game.add.button(450, baseH + 100, 'editorDraw', this.drawTool, this)
    this.tb.draw.anchor.set(0.5, 0.5)
    this.tb.draw.scale.set(0.4)

    this.tb.erase = this.game.add.button(600, baseH + 100, 'editorErase', this.eraseTool, this)
    this.tb.erase.anchor.set(0.5, 0.5)
    this.tb.erase.scale.set(0.4)

    this.tb.start = this.game.add.button(750, baseH + 100, 'editorStart', this.startTool, this)
    this.tb.start.anchor.set(0.5, 0.5)
    this.tb.start.scale.set(0.6)

    this.tb.save = this.game.add.button(900, baseH + 100, 'editorSave', this.save, this)
    this.tb.save.anchor.set(0.5, 0.5)
    this.tb.save.scale.set(0.4)

    this.tb.newPage = this.game.add.button(1650, baseH + 100, 'editorNewPage', this.newPage, this)
    this.tb.newPage.anchor.setTo(0.5, 0.5)
    this.tb.newPage.scale.set(0.4)

    this.tb.exit = this.game.add.button(1800, baseH + 100, 'editorExit', this.exit, this)
    this.tb.exit.anchor.setTo(0.5, 0.5)
    this.tb.exit.scale.set(0.8)

    this.marker = this.game.add.graphics()
    this.marker.lineStyle(2, 0xFFFFFF, 1)
    this.marker.drawRect(0, 0, 24, 24)
    this.marker.lineStyle(2, 0x000000, 1)
    this.marker.drawRect(0, 0, 22, 22)

    this.selector = this.game.add.graphics()
    this.selector.lineStyle(10, 0xFFFFFF, 1)
    this.selector.drawRect(-60, -60, 120, 120)
  },

  update: function () {
    var pointerX = this.game.input.activePointer.worldX
    var pointerY = this.game.input.activePointer.worldY

    for (var i = 0; i < this.points.length; i++) {
      var point = this.points[i]
      if (point) {
        if (i === this.selectedPoint) {
          point.alpha = 1
          point.scale.set(0.7)
        } else {
          point.alpha = 0.3
          point.scale.set(0.5)
        }
      }
    }

    // square around selected tool in toolbar
    this.selector.x = this.tb[this.tool].x
    this.selector.y = this.tb[this.tool].y

    if (pointerY < this.tb.bg.y) {
      // cursor square to mark drawing position
      this.marker.x = this.layer.getTileX(pointerX) * 24
      this.marker.y = this.layer.getTileY(pointerY) * 24

      var x = this.marker.x + 12
      var y = this.marker.y + 12

      if (!this.mouseWasDown) {
        this.prevCursorX = this.layer.getTileX(x)
        this.prevCursorY = this.layer.getTileY(y)
      }

      if (this.game.input.mousePointer.isDown) {
        this.mouseWasDown = true
        var line = new Phaser.Line(this.prevCursorX, this.prevCursorY, this.layer.getTileX(x), this.layer.getTileY(y))
        var linePoints = line.coordinatesOnLine()
        this.prevCursorX = this.layer.getTileX(x)
        this.prevCursorY = this.layer.getTileY(y)

        for (i = 0; i < linePoints.length; i++) {
          var tileX = linePoints[i][0]
          var tileY = linePoints[i][1]

          switch (this.tool) {
            case 'draw':
              if (this.map.getTile(tileX, tileY) == null) {
                this.map.putTile(0, tileX, tileY)
                this.levelArray[tileX * this.mapH + tileY] = 1
              }
              break

            case 'erase':
              if (this.map.getTile(tileX, tileY) != null) {
                this.map.removeTile(tileX, tileY)
                this.levelArray[tileX * this.mapH + tileY] = 0
              }

              // TODO this seems to cause crashes
              /*
              for (var i = 0; i < this.points.length; i++) {
                if (this.points[i] && this.points[i].input.pointerOver()) {
                  this.points[i].destroy()
                  for (var e = i; e < this.points.length-1; e++) {
                    this.points[e] = this.points[e+1]
                  }
                  this.points = this.points.slice(0, -1)
                  if (this.selectedPoint >= i) {
                    this.pointDec()
                  }
                  break
                }
              }*/
              break

            case 'point':
              if (this.points[this.selectedPoint] == null) {
                this.points[this.selectedPoint] = this.game.add.sprite(x, y, 'point')
                this.points[this.selectedPoint].anchor.set(0.5)
                this.points[this.selectedPoint].inputEnabled = true
              } else {
                this.points[this.selectedPoint].position.set(x, y)
              }
              this.pointsGrid[this.selectedPoint] = [this.layer.getTileX(x), this.layer.getTileX(y)]

              break
          }
        }
      } else {
        this.mouseWasDown = false
      }
    }

  /*
  if(this.game.physics.arcade.collide(players[0].sprite, this.layer)){
    players[0].kill()
  }*/
  },

  startTool: function () {
    this.tool = 'start'
  },

  drawTool: function () {
    this.tool = 'draw'
  },

  eraseTool: function () {
    this.tool = 'erase'
  },

  pointTool: function () {
    this.tool = 'point'
  },

  pointDec: function () {
    if (this.selectedPoint > 1) {
      this.selectedPoint--
    } else if (this.points.length > 0) {
      this.selectedPoint = this.points.length
    }
    this.tb.pointText.text = this.selectedPoint
  },

  pointInc: function () {
    if (this.selectedPoint < this.points.length) {
      this.selectedPoint++
    } else {
      this.selectedPoint = 1
    }
    this.tb.pointText.text = this.selectedPoint
  },

  backPressed: function () {
    this.game.state.start('Menu')
  },

  left: function () {
    this.pointDec()
  },

  right: function () {
    this.pointInc()
  },

  save: function () {
    var grid = this.pointsGrid
    for (var i = 1; i < grid.length; i++) {
      var x = grid[i][0]
      var y = grid[i][1]
      this.levelArray[x * this.mapH + y] = i + 1
    }

    var blob = new Blob([this.levelArray.join('')], {type: 'text/plain'})
    saveAs(blob, 'curvatron_level')
  },

  newPage: function () {
    this.state.restart(true, false, this.mode)
  },

  exit: function () {
    this.state.start('Menu')
  }

}
