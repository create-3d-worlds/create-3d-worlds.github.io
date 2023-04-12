import { scene, camera, renderer, clock, setBackground } from '/utils/scene.js'
import { ambLight, createMoon as createMoonLight } from '/utils/light.js'
import { Stars } from '/utils/classes/Particles.js'
import Score from '/utils/ui/Score.js'
import Lander from './Lander.js'
import Platform from './Platform.js'
import { loadModel } from '/utils/loaders.js'
import { createJupiter, createSaturn, createMoon, orbitAround } from '/utils/geometry/planets.js'

setBackground(0x000000)
camera.position.z = 18

ambLight({ intensity: .9 })
scene.add(createMoonLight({ pos: [30, 30, 30], intensity: .1 }))

const score = new Score({ subtitle: 'Fuel left', showHighScore: false })

const platform = new Platform()
const lander = new Lander({ platform })
const stars = new Stars({ minRadius: 150 })

const { mesh: arcology } = await loadModel({ file: 'space/arcology-ring/model.fbx', scale: .5, shouldCenter: true })
arcology.position.z = -100

const jupiter = createJupiter({ r: 5 })
jupiter.position.set(-125, 25, -80)

const moon = createMoon({ r: 1.5 })

const saturn = createSaturn({ r: 3 })
saturn.position.set(85, 20, -50)

scene.add(platform.mesh, lander.mesh, stars.mesh, arcology, jupiter, moon, saturn)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  const time = clock.getElapsedTime()

  platform.move(dt)
  lander.update(dt)
  lander.checkLanding()

  if (lander.onGround) platform.sync(lander.mesh, dt)
  // TODO: dodati poene jednokratno kad sleti
  if (lander.hasLanded) score.points = lander.fuel

  stars.update({ delta: dt * .005 })
  arcology.rotateY(dt * .02)
  jupiter.rotateY(dt * .2)
  moon.rotateY(dt)
  orbitAround({ moon, planet: jupiter, time: time * .5 })

  score.render(score.points, null, lander.fuel)
  score.renderText(lander.statusText ? lander.statusText + '<br><br><small>press R to play again</small>' : '')

  renderer.render(scene, camera)
}()
