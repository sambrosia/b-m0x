/* global PIXI */
import * as fae from 'fae'
const c = fae.components

const app = new fae.Application({
  backgroundColor: 0x3f2233,
  width: 1280,
  height: 720
})
document.body.appendChild(app.view)

function mainScene (app) {
  new fae.System(fae.systems.motion).start(app)
  new fae.System(fae.systems.PIXIAdapter).start(app)

  for (let i = 0; i < app.renderer.width * 0.5; i++) {
    const star = new fae.Entity(app, c.Transform, PIXI.Graphics)
    star.transform.position.x = Math.random() * app.renderer.width
    star.transform.position.y = Math.random() * app.renderer.height
    star.transform.rotation = Math.random() * Math.PI

    const size = Math.random() * 3 + 1
    star.graphics.beginFill(0xffffff - (0xffffff * Math.random()))
    .drawRect(-size / 2, -size / 2, size, size)
    .endFill()
    app.stage.addChild(star.graphics)
  }
}

app.enter(mainScene)
