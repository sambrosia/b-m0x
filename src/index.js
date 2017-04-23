import * as fae from 'fae'
import mainScene from './main'

export const app = new fae.Application({
  // backgroundColor: 0x3f2233,
  width: 1920,
  height: 1080
})
document.body.appendChild(app.view)
global.app = app

function resize () {
  const parentWidth = app.view.parentElement.clientWidth
  const parentHeight = app.view.parentElement.clientHeight

  if (parentWidth > parentHeight * 16 / 9) {
    app.view.style.height = parentHeight + 'px'
    app.view.style.width = Math.round(app.view.clientHeight * (16 / 9)) + 'px'
  } else {
    app.view.style.width = parentWidth + 'px'
    app.view.style.height = Math.round(app.view.clientWidth * (1 / (16 / 9))) + 'px'
  }
}
app.ticker.add(resize)

app.res = app.loader.resources
app.loader
.add('bg', 'assets/bg.png')
.add('panel', 'assets/panel.png')
.add('panel-glow', 'assets/panel-glow.png')
.add('noPower', 'assets/noPower.png')
.add('starInfo', 'assets/starInfo.png')
.add('scanPrompt', 'assets/scanPrompt.png')
.add('scannedIndicator', 'assets/scannedIndicator.png')
.add('replay', 'assets/replay.png')
.add('energy', 'assets/energy.png')
.add('bmoxFont', 'assets/bmoxFont.xml')

.add('bmoxGlow', 'assets/bmoxGlow.png')
.add('bmoxRing', 'assets/bmoxRing.png')
.add('bmoxHappy', 'assets/bmoxHappy.png')
.add('bmoxAngry', 'assets/bmoxAngry.png')
.add('bmoxSad', 'assets/bmoxSad.png')

.add('star1', 'assets/star1.png')
.add('star2', 'assets/star2.png')
.add('star3', 'assets/star3.png')
.add('star4', 'assets/star4.png')

.add('glow1', 'assets/glow1.png')
.add('glow2', 'assets/glow2.png')
.add('glow3', 'assets/glow3.png')
.add('glow4', 'assets/glow4.png')

.load((loader, resources) => {
  app.enter(mainScene)
})
