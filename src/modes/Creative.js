/*eslint-disable*/
/* global players, scale:true, adjustScreen */
/*eslint-enable*/
var Creative = function (game) {
  this.sp = true
  this.game = game
  this.player = null
  this.leaderboardID = null
  this.noCollisions = true
  this.popup = null
  this.twitter = null
  this.rToken = null
  this.rTokenSecret = null
}

Creative.prototype = {
  create: function () {
    this.player = players[0]
    scale = 0.3
    var screenShotSprite = this.game.add.button(100, 100, 'screenshot_button', this.takeScreenShot, this)
    screenShotSprite.anchor.setTo(0.5, 0.5)
    screenShotSprite.input.useHandCursor = true
    screenShotSprite.scale.set(0.5)
    screenShotSprite.alpha = 0.2
  },

  setScreen: function () {
    adjustScreen(this.game)
  },

  takeScreenShot: function () {
    /*
		this.game.canvas.toBlob(function(blob) {
      //saveAs(blob, "creative.png")
    });
		*/

    var png = this.game.canvas.toDataURL()
    this.png = png.replace(/^data:image\/png;base64,/, '')

    var TwitterAPI = require('node-twitter-api')
    this.twitter = new TwitterAPI({
      consumerKey: 'NwssUgdW5A1dKhtzExUFc5AtQ',
      consumerSecret: 'S4yhhvUDPKAEI4Wqwx9TCqLaQgsdcB8FjhPG6GyMLVK1xzgqeV',
      callback: 'http://bravebunny.co/'
    })

    this.twitter.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
      if (error) {
        console.log(error)
      } else {
        this.rToken = requestToken
        this.rTokenSecret = requestTokenSecret
        this.popup = window.open(this.twitter.getAuthUrl(this.rToken))
      }
    }.bind(this))
  },

  update: function () {
    if (this.popup !== null && this.popup.location.href.split('oauth_verifier=')[1] !== undefined) {
      this.tweetUpdate()
    }
  },

  tweetUpdate: function () {
    var oauthVerifier = this.popup.location.href.split('oauth_verifier=')[1]
    this.popup.close()
    this.popup = null

    var aToken, aTokenSecret

    this.twitter.getAccessToken(this.rToken, this.rTokenSecret, oauthVerifier, function (error, accessToken, accessTokenSecret, results) {
      if (error) {
        console.log(error)
      } else {
        aToken = accessToken
        aTokenSecret = accessTokenSecret

        var params = {
          media: this.png,
          isBase64: true
        }

        this.twitter.uploadMedia(params, aToken, aTokenSecret, function (error, response) {
          if (error) console.log(error)
          else {
            this.twitter.statuses('update', {
              status: 'I made art with #Curvatron',
              media_ids: response.media_id_string
            },
              aToken,
              aTokenSecret,
              function (error, data, response) {
                if (error) console.log(error)
              }
            )
          }
        }.bind(this))
      }
    }.bind(this))
  },

  erasesTrail: function () {
    return !this.player.ready
  }
}
