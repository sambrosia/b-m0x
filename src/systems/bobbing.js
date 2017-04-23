/* global performance */
import { app } from '../index'

const bobbing = {
  update (dt) {
    if (!app.groups.Bobber) return
    for (const e of app.groups.Bobber) {
      const x = e.bobber.position.x + Math.sin(performance.now() / e.bobber.speed.x) * e.bobber.strength.x
      const y = e.bobber.position.y + Math.cos(performance.now() / e.bobber.speed.y) * e.bobber.strength.y
      e.transform.position.set(x, y)
    }
  }
}

export default bobbing
