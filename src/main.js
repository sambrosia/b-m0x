/* global PIXI */
import * as fae from 'fae'
import generateStars from './stars'
import Bobber from './components/Bobber.js'
import bmoxFaces from './systems/bmoxFaces.js'
import bobbing from './systems/bobbing.js'
import energy from './systems/energy.js'
import scanner from './systems/scanner.js'

const c = fae.components

function startSystems (app) {
  new fae.System(fae.systems.PIXIAdapter).start(app)
  new fae.System(scanner).start(app)
  new fae.System(energy).start(app)
  new fae.System(bobbing).start(app)
  new fae.System(bmoxFaces).start(app)
}

export default function mainScene (app) {
  app.globals = {
    date: 2117,
    energy: 100,
    scanCost: 2
  }

  startSystems(app)

  app.stage.bg = app.stage.addChild(new PIXI.Container())
  app.stage.fg = app.stage.addChild(new PIXI.Container())

  const bg = new PIXI.Sprite(app.res.bg.texture)
  app.stage.bg.addChild(bg)

  generateStars(app)

  const panel = new fae.Entity(app, new c.Transform(), new PIXI.Sprite(app.res.panel.texture), new Bobber())
  app.stage.fg.addChild(panel.sprite)
  panel.glow = panel.sprite.addChild(new PIXI.Sprite(app.res['panel-glow'].texture))
  panel.bobber.position.y = 4
  panel.bobber.strength.set(0, 4)
  panel.bobber.speed.set(1, 600)

  const energyText = new fae.Entity(app, new c.Transform(), new PIXI.Sprite(app.res.energy.texture), new Bobber())
  app.stage.fg.addChild(energyText.sprite)
  energyText.bobber.position.set(20, 840)
  energyText.bobber.strength.set(0, 4)
  energyText.bobber.speed.set(1, 600)

  energyText.counter = energyText.sprite.addChild(new PIXI.extras.BitmapText('100%', { font: '40px bmoxFont' }))
  energyText.counter.position.set(480, 54)
  app.globals.energyCounter = energyText.counter

  const bmox = new fae.Entity(app, new c.Transform(), new PIXI.Container(), new Bobber())
  app.stage.fg.addChild(bmox.container)
  bmox.transform.position.set(1400, 0)
  bmox.bobber.position = new fae.utils.Vec2(bmox.transform.position)
  bmox.glow = bmox.container.addChild(new PIXI.Sprite(app.res.bmoxGlow.texture))
  bmox.ring = bmox.container.addChild(new PIXI.Sprite(app.res.bmoxRing.texture))
  bmox.face = bmox.container.addChild(new PIXI.Sprite(app.res.bmoxHappy.texture))
  app.event.emit('bmoxHappy', bmox)
}
