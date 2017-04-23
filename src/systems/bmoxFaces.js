import { app } from '../index'

const bmoxFaces = {
  bmoxHappy (bmox) {
    bmox.face.texture = app.res.bmoxHappy.texture
    bmox.bobber.strength.set(2, 12)
    bmox.bobber.speed.set(200, 800)
  },
  bmoxBlink (bmox) {},
  bmoxAngry (bmox) {
    bmox.face.texture = app.res.bmoxAngry.texture
    bmox.bobber.strength.set(12, 24)
    bmox.bobber.speed.set(100)
  }
}

export default bmoxFaces
