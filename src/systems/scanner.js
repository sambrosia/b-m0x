import { app } from '../index'
import Scanned from '../components/Scanned'

const scanner = {
  scanStar (star) {
    if (star.scanned) return
    if (app.globals.energy < app.globals.scanCost) return // FIXME rejection feedback/game over

    app.event.emit('changeEnergy', -app.globals.scanCost)
    star.attach(new Scanned())
    star.animatedSprite.interactive = false

    // TODO: Add scanned graphics to star
    console.log('Energy: ' + app.globals.energy + '%')
    console.log('Distance: ' + Math.round(star.scanned.distance * 10) / 10 + 'LY')
    console.log('Planets: ' + star.scanned.planets)
  }
}

export default scanner
