import { scene, camera, renderer, clock, setBackground } from '/utils/scene.js'
import { ambLight } from '/utils/light.js'
import { Stars } from '/utils/classes/Particles.js'
import Score from '/utils/ui/Score.js'
import Lander from './Lander.js'
import Platform from './Platform.js'
import { loadModel } from '/utils/loaders.js'
import { createJupiter, createSaturn, createMoon, orbitAround } from '/utils/geometry/planets.js'

setBackground(0x000000)
camera.position.z = 19

const score = new Score({ subtitle: 'Fuel left', showHighScore: false })

ambLight()
const platform = new Platform()
const lander = new Lander()
const stars = new Stars({ minRadius: 150 })

scene.add(platform.mesh, lander.mesh, stars.mesh)

const { mesh: arcology } = await loadModel({ file: 'space/arcology-ring/model.fbx', scale: .5, shouldCenter: true })
arcology.position.z = -100
scene.add(arcology)

const jupiter = createJupiter({ r: 5 })
jupiter.position.set(-125, 25, -80)
scene.add(jupiter)

const moon = createMoon({ r: 1.5 })
scene.add(moon)

const saturn = createSaturn({ r: 3 })
saturn.position.set(85, 20, -50)
scene.add(saturn)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  const time = clock.getElapsedTime()

  platform.move(dt)
  if (lander.hasLanded) {
    platform.sync(lander.mesh, dt)
    if (!lander.failure) score.points = lander.fuel
    score.renderText(lander.failure ? 'Landing failure!' : 'Nice landing!')
  }
  lander.update(dt)
  lander.checkLanding(platform, dt)

  stars.update({ delta: dt * .003 })
  arcology.rotateY(dt * .02)
  jupiter.rotateY(dt * .2)
  saturn.rotateY(dt * -.2)
  moon.rotateY(dt)

  orbitAround({ moon, planet: jupiter, time: time * .5, radiusX: 10, radiusZ: 12 })

  score.update(0, null, lander.fuel)
  renderer.render(scene, camera)
}()
