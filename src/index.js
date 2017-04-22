/* global PIXI */
import * as fae from 'fae'
const c = fae.components

const app = new fae.Application({
  backgroundColor: 0x3f2233,
  width: 1920,
  height: 1080
})
document.body.appendChild(app.view)

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

.add('star1', 'assets/star1.png')
.add('star2', 'assets/star2.png')
.add('star3', 'assets/star3.png')
.add('star4', 'assets/star4.png')

.add('glow1', 'assets/glow1.png')
.add('glow2', 'assets/glow2.png')
.add('glow3', 'assets/glow3.png')
.add('glow4', 'assets/glow4.png')
const res = app.loader.resources

function mainScene (app) {
  new fae.System(fae.systems.motion).start(app)
  new fae.System(fae.systems.PIXIAdapter).start(app)

  app.stage.bg = app.stage.addChild(new PIXI.Container())
  app.stage.fg = app.stage.addChild(new PIXI.Container())

  const bg = new PIXI.Sprite(res.bg.texture)
  const panelGlow = new PIXI.Sprite(res['panel-glow'].texture)
  const panel = new PIXI.Sprite(res.panel.texture)

  app.stage.bg.addChild(bg)
  app.stage.fg.addChild(panelGlow)
  app.stage.fg.addChild(panel)

  for (let i = 0; i < app.renderer.width * 0.15; i++) {
    let n = 1
    const r = Math.random()
    if (r < 0.9) n = Math.ceil(Math.random() * 2) + 1
    else n = Math.ceil(Math.random() * 4)

    const starTextures = [res['star' + n].texture]
    const glowTextures = [res['glow' + Math.ceil(Math.random() * 4)].texture]

    const star = new fae.Entity(app, new c.Transform(), new PIXI.extras.AnimatedSprite(starTextures))
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

    app.stage.bg.addChild(star.animatedSprite)
  }
}

app.loader.load((loader, resources) => {
  app.enter(mainScene)
})
