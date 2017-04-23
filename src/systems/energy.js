import { app } from '../index'

const energy = {
  changeEnergy (n) {
    app.globals.energy += n
    app.globals.energyCounter.text = app.globals.energy + '%'

    if (app.globals.energy <= 25) app.event.emit('bmoxEmote', 'Angry')
    // TODO: Message saying "I'm getting low on power!"
  }
}

export default energy
