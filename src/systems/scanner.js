/* global PIXI */
import { app } from '../index'
import Scanned from '../components/Scanned'
import mainScene from '../main'

const scanner = {
  scanStar (star) {
    if (star.scanned) return
    if (app.globals.energy < app.globals.scanCost) return

    app.event.emit('changeEnergy', -app.globals.scanCost)
    star.attach(new Scanned())
    star.animatedSprite.interactive = false

    // TODO: Add scanned graphics to star
    console.log('Energy: ' + app.globals.energy + '%')
    console.log('Distance: ' + Math.round(star.scanned.distance * 10) / 10 + 'LY')
    console.log('Planets: ' + star.scanned.planets)

    if (app.globals.energy <= 0) {
      // TODO: Game over
      app.stage.bg.filters = [new PIXI.filters.BlurFilter(4, 2, 2)]
      app.stage.bg.interactiveChildren = false
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
  }
}

export default scanner
