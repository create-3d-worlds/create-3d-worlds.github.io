import { scene, camera, renderer, clock, setBackground } from '/utils/scene.js'
import { ambLight, createMoon } from '/utils/light.js'
import { Stars } from '/utils/classes/Particles.js'
import Score from '/utils/ui/Score.js'
import Lander from './Lander.js'
import Platform from '/utils/actor/child/Platform.js'
import { loadModel } from '/utils/loaders.js'
import { createSphere } from '/utils/geometry.js'
import { createJupiter, createSaturn, orbitAround } from '/utils/geometry/planets.js'
import input from '/utils/classes/Input.js'

setBackground(0x000000)
camera.position.z = 18

ambLight({ intensity: .9 })
const moonLight = createMoon({ pos: [30, 30, 30], intensity: .1 })

const score = new Score({ subtitle: 'Fuel left', showHighScore: false })

const platform = new Platform({ pos: [0, -10, 0], axis: 'x', range: 29, randomDirChange: true })
const lander = new Lander({ platform })
const stars = new Stars({ minRadius: 150 })

const arcology = await loadModel({ file: 'space/arcology-ring/model.fbx', scale: .5, shouldCenter: true })
arcology.position.z = -100

const jupiter = createJupiter({ r: 5 })
jupiter.position.set(-125, 25, -80)

const moon = createSphere({ r: 1.5, file: 'planets/moon.jpg' })

const saturn = createSaturn({ r: 3 })
saturn.position.set(85, 20, -50)

scene.add(platform.mesh, lander.mesh, stars.mesh, arcology, jupiter, saturn, moon, moonLight)

/* LOOP */

let time = 0

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)

  const dt = clock.getDelta()
  if (input.pause) return

  platform.update(dt)
  lander.update(dt)

  score.points = lander.hasLanded ? lander.fuel : 0

  stars.update({ delta: dt * .005 })
  arcology.rotateY(dt * .02)
  jupiter.rotateY(dt * .2)
  moon.rotateY(dt)
  orbitAround({ moon, planet: jupiter, time: time += dt * .75 })

  score.render(score.points, null, lander.fuel)
  score.renderText(lander.statusText ? lander.statusText + '<br><br><small>press R to play again</small>' : '')
}()
