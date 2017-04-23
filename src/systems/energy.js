/* global PIXI */
import { app } from '../index'
import mainScene from '../main'

const energy = {
  changeEnergy (n) {
    app.globals.energy += n
    app.globals.energyCounter.text = app.globals.energy + '%'

    if (app.globals.energy <= 25) app.event.emit('bmoxEmote', 'Angry')
    // TODO: Message saying "I'm getting low on power!"

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
  }
}

export default energy
