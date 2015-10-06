/* global setScreenFixed, baseW, baseH, Phaser, colorHexDark, Blob, saveAs
*/
var editor = function (game) {
  this.game = game
  this.layer = null
  this.marker = null
  this.map = null
  this.tb = {}
  this.prevCursorX = 0
  this.prevCursorY = 0
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
    // variables that need to be reset
    this.tool = 'draw' // 0=draw, 1=erase, 2=point
    this.selectedPoint = 1
    this.points = []
    this.pointPositions = []
    this.levelArray = []
    this.mapW = 60
    this.mapH = 34
    this.tileSize = 32
    this.mouseWasDown = false

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

    this.tb.save = this.game.add.button(1500, baseH + 100, 'editorSave', this.save, this)
    this.tb.save.anchor.set(0.5, 0.5)
    this.tb.save.scale.set(0.4)

    this.tb.newPage = this.game.add.button(1650, baseH + 100, 'editorNewPage', this.newPage, this)
    this.tb.newPage.anchor.setTo(0.5, 0.5)
    this.tb.newPage.scale.set(0.4)

    this.tb.exit = this.game.add.button(1800, baseH + 100, 'editorExit', this.exit, this)
    this.tb.exit.anchor.setTo(0.5, 0.5)
    this.tb.exit.scale.set(0.8)

    // the square that shows under the mouse to show what's selected
    this.marker = this.game.add.graphics()
    this.marker.lineStyle(2, 0xFFFFFF, 1)
    this.marker.drawRect(0, 0, this.tileSize, this.tileSize)
    this.marker.lineStyle(2, 0x000000, 1)
    this.marker.drawRect(0, 0, this.tileSize - 2, this.tileSize - 2)

    this.selector = this.game.add.graphics()
    this.selector.lineStyle(10, 0xFFFFFF, 1)
    this.selector.drawRect(-60, -60, 120, 120)

    // grid overlay
    var gridBMD = this.game.add.bitmapData(this.game.width, this.game.height)
    var gridImage = gridBMD.addToWorld()
    gridImage.alpha = 0.3
    var gridSize = this.tileSize * 3

    this.overlay = gridBMD.ctx
    this.overlay.strokeStyle = '#FFFFFF'
    this.overlay.lineWidth = 1
    this.overlay.beginPath()
    this.overlay.moveTo(0, 0)
    for (var i = 1; i < this.mapW / 3; i++) {
      this.overlay.moveTo(i * gridSize, 0)
      this.overlay.lineTo(i * gridSize, this.tb.bg.y)
      this.overlay.moveTo((i + 1) * gridSize, this.tb.bg.y)
      this.overlay.lineTo((i + 1) * gridSize, 0)
    }
    this.overlay.moveTo(0, 0)
    for (var e = 1; e < this.mapH / 3 - 1; e++) {
      this.overlay.moveTo(0, e * gridSize)
      this.overlay.lineTo(this.game.width, e * gridSize)
      this.overlay.moveTo(this.game.width, (e + 1) * gridSize)
      this.overlay.lineTo(0, (e + 1) * gridSize)
    }
    this.overlay.stroke()
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
      this.marker.x = this.layer.getTileX(pointerX) * this.tileSize
      this.marker.y = this.layer.getTileY(pointerY) * this.tileSize

      var x = this.marker.x + this.tileSize / 2
      var y = this.marker.y + this.tileSize / 2
      var tileX = this.layer.getTileX(x)
      var tileY = this.layer.getTileY(y)

      if (!this.mouseWasDown) {
        this.prevCursorX = tileX
        this.prevCursorY = tileY
      }

      if (this.game.input.mousePointer.isDown) {
        this.mouseWasDown = true
        var line = new Phaser.Line(this.prevCursorX, this.prevCursorY, tileX, tileY)
        var linePoints = line.coordinatesOnLine()
        this.prevCursorX = tileX
        this.prevCursorY = tileY

        for (i = 0; i < linePoints.length; i++) {
          var lineX = linePoints[i][0]
          var lineY = linePoints[i][1]
          var index = lineX * this.mapH + lineY

          switch (this.tool) {
            case 'draw':
              if (this.levelArray[index] === 0) {
                this.map.putTile(0, lineX, lineY)
                this.levelArray[index] = 1
              }
              break

            case 'erase':
              if (this.map.getTile(lineX, lineY) != null) {
                this.map.removeTile(lineX, lineY)
              }

              if (this.levelArray[index] === 2) { // true if is a point
                var pointN = this.pointPositions.indexOf(index)
                this.points[pointN].destroy()
                for (var e = pointN; e < this.points.length - 1; e++) {
                  this.pointPositions[e] = this.pointPositions[e + 1]
                  this.points[e] = this.points[e + 1]
                }
                this.points = this.points.slice(0, -1)
                this.pointPositions = this.pointPositions.slice(0, -1)
                if (this.selectedPoint >= pointN) {
                  this.pointDec()
                }
              }

              this.levelArray[index] = 0
              break

            case 'point':
              if (this.levelArray[index] === 0) {
                if (this.points[this.selectedPoint] == null) {
                  this.points[this.selectedPoint] = this.game.add.sprite(x, y, 'point')
                  this.points[this.selectedPoint].anchor.set(0.5)
                  this.points[this.selectedPoint].inputEnabled = true
                } else {
                  this.levelArray[this.pointPositions[this.selectedPoint]] = 0
                  this.points[this.selectedPoint].position.set(x, y)
                }
                this.levelArray[index] = 2
                this.pointPositions[this.selectedPoint] = index
                // this.pointsGrid[this.selectedPoint] = [tileX, this.layer.getTileX(y)]
              }
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
    for (var i = 0; i < this.pointPositions.length; i++) {
      this.levelArray[this.pointPositions[i]] = i + 1
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
