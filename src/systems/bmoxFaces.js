import { app } from '../index'

const bmoxFaces = {
  bmoxEmote (emotion) {
    const bmox = app.globals.bmox
    switch (emotion) {
      case 'Happy':
        bmox.face.texture = app.res.bmoxHappy.texture
        bmox.bobber.strength.set(2, 12)
        bmox.bobber.speed.set(200, 800)
        break
      case 'Angry':
        bmox.face.texture = app.res.bmoxAngry.texture
        bmox.bobber.strength.set(12, 24)
        bmox.bobber.speed.set(100)
        break
      case 'Sad':
        bmox.face.texture = app.res.bmoxSad.texture
        bmox.bobber.strength.set(0, 32)
        bmox.bobber.speed.set(1500)
        break
    }
  },
  bmoxBlink (bmox) {}
}

export default bmoxFaces
