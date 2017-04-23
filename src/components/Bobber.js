import * as fae from 'fae'

export default class Bobber extends fae.Component {
  constructor () {
    super()
    this.position = new fae.utils.Vec2()
    this.strength = new fae.utils.Vec2()
    this.speed = new fae.utils.Vec2()
  }
}
