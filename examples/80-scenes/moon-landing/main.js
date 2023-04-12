import { scene, camera, renderer, clock, setBackground } from '/utils/scene.js'
import { createMoon } from '/utils/light.js'
import { Stars } from '/utils/classes/Particles.js'
import Score from '/utils/ui/Score.js'
import Lander from './Lander.js'
import Platform from './Platform.js'

setBackground(0x000000)
camera.position.z = 18

const score = new Score({ subtitle: 'Fuel left' })

const moon = createMoon({ pos: [30, 0, 30] })
const platform = new Platform()
const lander = new Lander()
const stars = new Stars()

scene.add(moon, platform.mesh, lander.mesh, stars.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()

  platform.move(dt)
  if (lander.hasLanded) {
    platform.sync(lander.mesh, dt)
    if (!lander.failure) score.points = lander.fuel
    score.renderText(lander.failure ? 'Landing failure!' : 'Nice landing!')
  }
  lander.update(dt)
  lander.checkLanding(platform, dt)

  stars.update({ delta: dt * .003 })
  score.update(0, null, lander.fuel)

  renderer.render(scene, camera)
}()
