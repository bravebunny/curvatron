/*eslint-disable*/
/* global spawnPowers:true, players, totalTime, PowerUp, w2,
h2, countdown, colorPlayers, adjustScreen */
/*eslint-enable*/
var MPNormal = function (nPlayers, game) {
  this.game = game
  this.nPlayers = nPlayers
  this.spawnPowers = true
  this.highScore = 0
  this.gridded = true
}

MPNormal.prototype = {
  create: function (manager) {
    this.crowned = -1
    this.lastCrowned = -1
    this.manager = manager
    this.highScore = 0
    spawnPowers = true
  },

  update: function () {
    if (this.crowned !== -1) {
      players[this.crowned].addCrown()
    }
    if (!countdown) {
      if (this.manager.gameTime >= (totalTime)) {
        this.manager.ui.timeCircle.scale.set((-1 / this.manager.gameTime) * (totalTime) + 1)
      } else {
        this.manager.endGame()
      }
    }

    var numberAlive = 0
    var playerAlive = -1
    for (var i = 0; i < players.length; i++) {
      if (!players[i].dead) {
        playerAlive = i
        numberAlive++
        if (numberAlive > 1) break
      }
    }
    if (numberAlive < 2) {
      this.lastCrowned = playerAlive
      this.manager.endGame()
    }
  },

  erasesTrail: function () {
    return true
  },

  collect: function (playerSprite, powerSprite, player) {
    player.growth = 60 * powerSprite.scale.x
    player.size += player.growth

    if (player.size > this.highScore) {
      this.highScore = player.size
      if (this.crowned > -1) {
        players[this.crowned].removeCrown()
      }
      this.lastCrowned = this.crowned
      this.crowned = player.id
    }
  },

  kill: function () {
    var alreadyDead = 0
    for (var i = 0; i < players.length; i++) {
      if (players[i].dead) {
        alreadyDead++
      }
    }

    var newMax = 0
    for (i = 0; i < players.length; i++) {
      if (players.length - alreadyDead === 1 && i !== this.id && !players[i].dead) {
        newMax = players[i].size
        this.crowned = i
      } else if (i !== this.id && players[i].size > newMax && !players[i].dead) {
        newMax = players[i].size
        this.crowned = i
      }
    }

    if (this.crowned !== -1 && players[this.crowned].dead) {
      this.crowned = -1
      this.highScore = 0
    }
  },

  createPower: function () {
    if (!countdown) {
      var powerup = new PowerUp(this.game, 'pointMP', this)
      powerup.create()
    }
  },

  endGame: function (bottomY) {
    if (this.crowned === -1) {
      var tie = this.game.add.sprite(w2, h2 + 250, 'tie')
      tie.anchor.setTo(0.5, 0.5)
    } else {
      var winnerFill = this.game.add.sprite(w2 - 75, bottomY + 157, 'player' + players[this.crowned].id)
      winnerFill.scale.set(5)
      winnerFill.anchor.setTo(0.5, 0.5)

      var winnerLabel = this.game.add.sprite(w2, bottomY + 157, 'winner')
      winnerLabel.scale.set(1, 1)
      winnerLabel.anchor.setTo(0.5, 0.5)
      var textWinner = this.game.add.text(w2 + 50, bottomY + 160, String.fromCharCode(players[this.crowned].key), {
        font: '100px dosis',
        fill: colorPlayers[this.crowned],
        align: 'center'
      })
      textWinner.anchor.setTo(0.5, 0.5)
    }
  },

  setScreen: function () {
    adjustScreen(this.game)
  },

  getHighScore: function () {
    return this.highScore
  },

  setHighScore: function (score) {
    this.highScore = score
  }
}
