import * as fae from 'fae'

export default class Scanned extends fae.Component {
  constructor () {
    super()
    this.distance = 0.02 * Math.pow(Math.random() * 1000, 2)
    this.planets = Math.random() < 0.8 ? Math.floor(Math.random() * 16) : 0
  }
}
