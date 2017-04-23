import { app } from '../index'

const energy = {
  changeEnergy (n) {
    app.globals.energy += n
    app.globals.energyCounter.text = app.globals.energy + '%'
  }
}

export default energy
