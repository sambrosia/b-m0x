/* global PIXI */
import * as fae from 'fae'
import generateStars from './stars'
import Bobber from './components/Bobber.js'
import bmoxFaces from './systems/bmoxFaces.js'
import bobbing from './systems/bobbing.js'
import energy from './systems/energy.js'
import scanner from './systems/scanner.js'

const c = fae.components

export default function mainScene (app) {
  app.globals = {
    starsUnderPointer: 0,
    energy: 100,
    scanCost: 5,
    starsScanned: 0,
    currentStar: null
  }

  new fae.System(fae.systems.PIXIAdapter).start(app)
  new fae.System(scanner).start(app)
  new fae.System(energy).start(app)
  new fae.System(bobbing).start(app)
  new fae.System(bmoxFaces).start(app)

  app.stage.bg = app.stage.addChild(new PIXI.Container())
  app.stage.fg = app.stage.addChild(new PIXI.Container())

  const bg = new PIXI.Sprite(app.res.bg.texture)
  app.stage.bg.addChild(bg)

  generateStars(app)

  app.res.soundOn.sound.play()

  const panel = new fae.Entity(app, new c.Transform(), new PIXI.Sprite(app.res.panel.texture), new Bobber())
  app.stage.fg.addChild(panel.sprite)
  panel.glow = panel.sprite.addChild(new PIXI.Sprite(app.res['panel-glow'].texture))
  panel.bobber.position.set(-30, 4)
  panel.bobber.strength.set(0, 4)
  panel.bobber.speed.set(1, 600)
  panel.sprite.alpha = 0.75

  const energyText = new fae.Entity(app, new c.Transform(), new PIXI.Sprite(app.res.energy.texture), new Bobber())
  app.stage.fg.addChild(energyText.sprite)
  energyText.bobber.position.set(80, 940)
  energyText.bobber.strength.set(0, 4)
  energyText.bobber.speed.set(1, 600)
  energyText.sprite.alpha = 0.75

  energyText.counter = energyText.sprite.addChild(new PIXI.extras.BitmapText('100%', { font: '40px bmoxFont' }))
  energyText.counter.position.set(210, 12)
  app.globals.energyCounter = energyText.counter

  const bmox = new fae.Entity(app, new c.Transform(), new PIXI.Container(), new Bobber())
  app.stage.fg.addChild(bmox.container)
  app.globals.bmox = bmox
  bmox.container.alpha = 0.75

  bmox.transform.position.set(1400, 0)
  bmox.bobber.position = new fae.utils.Vec2(bmox.transform.position)
  bmox.glow = bmox.container.addChild(new PIXI.Sprite(app.res.bmoxGlow.texture))
  bmox.ring = bmox.container.addChild(new PIXI.Sprite(app.res.bmoxRing.texture))
  bmox.face = bmox.container.addChild(new PIXI.Sprite(app.res.bmoxHappy.texture))
  app.event.emit('bmoxEmote', 'Happy')

  const scanPrompt = new PIXI.Sprite(app.res.scanPrompt.texture)
  scanPrompt.anchor.set(0.5)
  scanPrompt.visible = false
  app.stage.scanPrompt = app.stage.fg.addChild(scanPrompt)

  const scannerGraph = app.stage.bg.addChild(new PIXI.Graphics())
  app.globals.scannerGraph = scannerGraph
  scannerGraph.lineStyle(4, 0x83ffe0, 0.3)

  const starInfo = new PIXI.Sprite(app.res.starInfo.texture)
  panel.sprite.addChild(starInfo)
  starInfo.position.set(80, 40)
  starInfo.number = starInfo.addChild(new PIXI.extras.BitmapText('0', { font: '40px bmoxFont' }))
  starInfo.number.position.set(200, 4)

  starInfo.distance = starInfo.addChild(new PIXI.extras.BitmapText('0', { font: '40px bmoxFont' }))
  starInfo.distance.position.set(200, 70)

  starInfo.planets = starInfo.addChild(new PIXI.extras.BitmapText('0', { font: '40px bmoxFont' }))
  starInfo.planets.position.set(200, 132)

  app.globals.starInfo = starInfo
}
