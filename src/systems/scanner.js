/* global PIXI */
import * as fae from 'fae'
import { app } from '../index'
import Scanned from '../components/Scanned'
import mainScene from '../main'

const scanner = {
  scanStar (star) {
    if (star.scanned) return
    if (app.globals.energy < app.globals.scanCost) return

    app.event.emit('changeEnergy', -app.globals.scanCost)
    star.attach(new Scanned())

    if (star === app.globals.sol) star.scanned.planets = 8

    if (star.scanned.planets === 8) {
      star.scanned.indicator = star.animatedSprite.addChild(new PIXI.Sprite(app.res.candidateIndicator.texture))

      star.animatedSprite.on('pointerover', event => {
        app.stage.scanPrompt.texture = app.res.sendMessage.texture
      })

      star.animatedSprite.removeAllListeners('pointertap')
      star.animatedSprite.on('pointertap', event => {
        app.event.emit('sendMessage', star)
      })
    } else {
      star.scanned.indicator = star.animatedSprite.addChild(new PIXI.Sprite(app.res.scannedIndicator.texture))
      star.animatedSprite.interactive = false
    }
    star.scanned.indicator.anchor.set(0.5)

    if (app.globals.knownStars.includes(star)) {
      const startPoint = star.transform.position
      const offset = app.globals.sol.transform.position.minus(startPoint)
      offset.add(new fae.utils.Vec2((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50))
      offset.multiply(0.75 + Math.random() * 1.5)

      app.globals.scannerGraph
      .moveTo(startPoint.x, startPoint.y)
      .lineTo(startPoint.x + offset.x, startPoint.y + offset.y)
    }

    app.globals.starsScanned++

    app.globals.currentStar = star
    app.globals.starInfo.number.text = app.globals.starsScanned
    app.globals.starInfo.distance.text = Math.round(star.scanned.distance)
    app.globals.starInfo.planets.text = star.scanned.planets

    app.globals.starsUnderPointer--
    if (app.globals.starsUnderPointer <= 0) app.stage.scanPrompt.visible = false
  },

  sendMessage (star) {
    const responseTime = star.scanned.distance * 2
    const powerTimeLeft = app.globals.energy * (500 + Math.random() * 10)
    if (star !== app.globals.sol || powerTimeLeft < responseTime) {
      app.event.emit('noResponse', Math.round(powerTimeLeft))
    } else {
      app.event.emit('response', Math.round(responseTime))
    }
  },

  noResponse (timeWaited) {
    app.stage.bg.filters = [new PIXI.filters.BlurFilter(4, 2, 2)]
    app.stage.bg.interactiveChildren = false
    app.stage.scanPrompt.visible = false
    app.event.emit('bmoxEmote', 'Sad')
    app.globals.energyCounter.text = '0%'

    const noResponse = app.stage.fg.addChild(new PIXI.Sprite(app.res.noResponse.texture))
    noResponse.anchor.set(0.5)
    noResponse.position.set(app.renderer.width / 2, 400)

    const yearsText = app.stage.fg.addChild(new PIXI.extras.BitmapText(timeWaited.toString(), { font: '40px bmoxFont' }))
    yearsText.anchor.set(0.5)
    yearsText.position.set(app.renderer.width / 2 - 12, 360)

    const replay = app.stage.fg.addChild(new PIXI.Sprite(app.res.replay.texture))
    replay.anchor.set(0.5)
    replay.position.set(app.renderer.width / 2, 760)
    replay.interactive = true
    replay.buttonMode = true
    replay.on('pointertap', event => {
      app.enter(mainScene)
    })
  },

  response (timeWaited) {
    app.stage.bg.filters = [new PIXI.filters.BlurFilter(4, 2, 2)]
    app.stage.bg.interactiveChildren = false
    app.stage.scanPrompt.visible = false
    app.event.emit('bmoxEmote', 'Happy')

    const response = app.stage.fg.addChild(new PIXI.Sprite(app.res.responseMessage.texture))
    response.anchor.set(0.5)
    response.position.set(app.renderer.width / 2, 400)

    const yearsText = app.stage.fg.addChild(new PIXI.extras.BitmapText(timeWaited.toString(), { font: '40px bmoxFont' }))
    yearsText.anchor.set(0.5)
    yearsText.position.set(app.renderer.width / 2 - 12, 260)
  }
}

export default scanner
