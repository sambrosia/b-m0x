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
        // FIXME: Send message and show game over screen w/ response/time waited
        console.log('send message');
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

    if (app.globals.energy <= 0) {
      app.stage.bg.filters = [new PIXI.filters.BlurFilter(4, 2, 2)]
      app.stage.bg.interactiveChildren = false
      app.stage.scanPrompt.visible = false
      app.event.emit('bmoxEmote', 'Sad')

      const noPower = app.stage.fg.addChild(new PIXI.Sprite(app.res.noPower.texture))
      noPower.anchor.set(0.5)
      noPower.position.set(app.renderer.width / 2, 400)

      const replay = app.stage.fg.addChild(new PIXI.Sprite(app.res.replay.texture))
      replay.anchor.set(0.5)
      replay.position.set(app.renderer.width / 2, 700)
      replay.interactive = true
      replay.buttonMode = true
      replay.on('pointertap', event => {
        app.enter(mainScene)
      })
    }
  },

  sendMessage (star) {

  }
}

export default scanner
