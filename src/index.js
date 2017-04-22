/* global PIXI performance */
import * as fae from 'fae'
const c = fae.components

const app = new fae.Application({
  // backgroundColor: 0x3f2233,
  width: 1920,
  height: 1080
})
document.body.appendChild(app.view)
global.app = app

function resize () {
  const parentWidth = app.view.parentElement.clientWidth
  const parentHeight = app.view.parentElement.clientHeight

  if (parentWidth > parentHeight * 16 / 9) {
    app.view.style.height = parentHeight + 'px'
    app.view.style.width = Math.round(app.view.clientHeight * (16 / 9)) + 'px'
  } else {
    app.view.style.width = parentWidth + 'px'
    app.view.style.height = Math.round(app.view.clientWidth * (1 / (16 / 9))) + 'px'
  }
}
app.ticker.add(resize)

app.loader
.add('bg', 'assets/bg.png')
.add('panel', 'assets/panel.png')
.add('panel-glow', 'assets/panel-glow.png')

.add('bmoxGlow', 'assets/bmoxGlow.png')
.add('bmoxRing', 'assets/bmoxRing.png')
.add('bmoxHappy', 'assets/bmoxHappy.png')
.add('bmoxAngry', 'assets/bmoxAngry.png')

.add('star1', 'assets/star1.png')
.add('star2', 'assets/star2.png')
.add('star3', 'assets/star3.png')
.add('star4', 'assets/star4.png')

.add('glow1', 'assets/glow1.png')
.add('glow2', 'assets/glow2.png')
.add('glow3', 'assets/glow3.png')
.add('glow4', 'assets/glow4.png')
const res = app.loader.resources

app.globals = {
  date: 2117,
  energy: 100,
  scanCost: 2
}

class Scanned extends fae.Component {
  constructor () {
    super()
    this.distance = 0.02 * Math.pow(Math.random() * 1000, 2)
    this.planets = Math.random() < 0.8 ? Math.floor(Math.random() * 16) : 0
  }
}

class Bobber extends fae.Component {
  constructor () {
    super()
    this.position = new fae.utils.Vec2()
    this.strength = new fae.utils.Vec2()
    this.speed = new fae.utils.Vec2()
  }
}

const BmoxFaces = {
  bmoxHappy (bmox) {
    bmox.face.texture = res.bmoxHappy.texture
    bmox.bobber.strength.set(2, 12)
    bmox.bobber.speed.set(200, 800)
  },
  bmoxBlink (bmox) {

  },
  bmoxAngry (bmox) {
    bmox.face.texture = res.bmoxAngry.texture
    bmox.bobber.strength.set(12, 24)
    bmox.bobber.speed.set(100)
  }
}

const Scanner = {
  scanStar (star) {
    if (star.scanned) return
    if (app.globals.energy < app.globals.scanCost) return // FIXME rejection feedback/game over

    app.globals.energy -= app.globals.scanCost
    star.attach(new Scanned())
    star.animatedSprite.interactive = false

    // TODO: Add scanned graphics to star
    console.log('Energy: ' + app.globals.energy + '%')
    console.log('Distance: ' + Math.round(star.scanned.distance * 10) / 10 + 'LY')
    console.log('Planets: ' + star.scanned.planets)
  }
}

const Energy = {}

const Bobbing = {
  update (dt) {
    if (!app.groups.Bobber) return
    for (const e of app.groups.Bobber) {
      const x = e.bobber.position.x + Math.sin(performance.now() / e.bobber.speed.x) * e.bobber.strength.x
      const y = e.bobber.position.y + Math.cos(performance.now() / e.bobber.speed.y) * e.bobber.strength.y
      e.transform.position.set(x, y)
    }
  }
}

function mainScene (app) {
  new fae.System(fae.systems.PIXIAdapter).start(app)
  new fae.System(Scanner).start(app)
  new fae.System(Energy).start(app)
  new fae.System(Bobbing).start(app)
  new fae.System(BmoxFaces).start(app)

  app.stage.bg = app.stage.addChild(new PIXI.Container())
  app.stage.fg = app.stage.addChild(new PIXI.Container())

  const bg = new PIXI.Sprite(res.bg.texture)

  const panel = new fae.Entity(app, new c.Transform(), new PIXI.Sprite(res.panel.texture), new Bobber())
  panel.glow = panel.sprite.addChild(new PIXI.Sprite(res['panel-glow'].texture))
  panel.bobber.position.y = 4
  panel.bobber.strength.set(0, 4)
  panel.bobber.speed.set(1, 1000)

  app.stage.bg.addChild(bg)
  app.stage.fg.addChild(panel.sprite)

  for (let i = 0; i < app.renderer.width * 0.15; i++) {
    let n = 1
    const r = Math.random()
    if (r < 0.9) n = Math.ceil(Math.random() * 2) + 1
    else n = Math.ceil(Math.random() * 4)

    const starTextures = [res['star' + n].texture]
    const glowTextures = [res['glow' + Math.ceil(Math.random() * 4)].texture]

    const star = new fae.Entity(app, new c.Transform(), new PIXI.extras.AnimatedSprite(starTextures))
    app.stage.bg.addChild(star.animatedSprite)
    star.group('star')

    star.transform.position.x = Math.random() * app.renderer.width
    star.transform.position.y = Math.random() * app.renderer.height
    star.transform.rotation = (Math.random() - 0.5) * 0.5
    star.animatedSprite.anchor.set(0.5)

    if (n === 4 || n === 1) {
      star.glow = star.animatedSprite.addChild(new PIXI.extras.AnimatedSprite(glowTextures))
      star.glow.anchor.set(0.5)
    } else {
      star.animatedSprite.alpha -= Math.random() * 0.6
    }

    star.animatedSprite.hitArea = new PIXI.Circle(0, 0, 20)
    star.animatedSprite.interactive = true
    star.animatedSprite.buttonMode = true

    star.animatedSprite.on('pointertap', event => {
      app.event.emit('scanStar', star)
    })

    star.animatedSprite.on('pointerover', event => {
      // TODO: Hover indicator
    })
  }

  const bmox = new fae.Entity(app, new c.Transform(), new PIXI.Container(), new Bobber())
  app.stage.fg.addChild(bmox.container)

  bmox.transform.position.set(1400, 0)
  bmox.bobber.position = new fae.utils.Vec2(bmox.transform.position)

  bmox.glow = bmox.container.addChild(new PIXI.Sprite(res.bmoxGlow.texture))
  bmox.ring = bmox.container.addChild(new PIXI.Sprite(res.bmoxRing.texture))
  bmox.face = bmox.container.addChild(new PIXI.Sprite(res.bmoxHappy.texture))

  app.event.emit('bmoxHappy', bmox)
}

app.loader.load((loader, resources) => {
  app.enter(mainScene)
})
