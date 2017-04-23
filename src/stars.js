/* global PIXI */
import * as fae from 'fae'
const c = fae.components

export default function generateStars (app) {
  const stars = []

  for (let i = 0; i < app.renderer.width * 0.15; i++) {
    let n = 1
    const r = Math.random()
    if (r < 0.95) n = Math.ceil(Math.random() * 2) + 1
    else n = Math.ceil(Math.random() * 4)

    const starTextures = [app.res['star' + n].texture]
    const glowTextures = [app.res['glow' + Math.ceil(Math.random() * 4)].texture]

    const star = new fae.Entity(app, new c.Transform(), new PIXI.extras.AnimatedSprite(starTextures))
    app.stage.bg.addChild(star.animatedSprite)
    star.group('star')
    stars.push(star)

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
      app.globals.starsUnderPointer++
      app.stage.scanPrompt.visible = true
      app.stage.scanPrompt.texture = app.res.scanPrompt.texture
      app.stage.scanPrompt.position.set(star.transform.x, star.transform.y)
    })

    star.animatedSprite.on('pointerout', event => {
      app.globals.starsUnderPointer--
      if (app.globals.starsUnderPointer <= 0) app.stage.scanPrompt.visible = false
    })
  }

  const solIndex = Math.round(Math.random() * (stars.length - 1))
  app.globals.sol = stars[solIndex]

  const knownStarIndices = []
  for (let i = 0; i < 30; i++) {
    let starIndex = 0
    while (knownStarIndices.includes(starIndex) || starIndex === solIndex) {
      starIndex = Math.round(Math.random() * (stars.length - 1))
    }
    knownStarIndices[i] = starIndex
  }

  app.globals.knownStars = []
  for (const i of knownStarIndices) {
    app.globals.knownStars.push(stars[i])
  }
}
