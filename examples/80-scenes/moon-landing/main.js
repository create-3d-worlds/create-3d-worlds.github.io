import { scene, camera, createToonRenderer, clock } from '/utils/scene.js'
import { ambLight, createMoon, orbitAround } from '/utils/light.js'
import { Stars } from '/utils/Particles.js'
import Score from '/utils/io/Score.js'
import Platform from '/utils/objects/Platform.js'
import { loadModel } from '/utils/loaders.js'
import { createSphere } from '/utils/geometry/index.js'
import { createJupiter, createSaturn } from '/utils/geometry/planets.js'

let arcology, lander

const renderer = await createToonRenderer()

document.body.style.background = 'linear-gradient(to bottom, #020111 70%, #191621 100%)'
camera.position.z = 18

ambLight({ intensity: .9 })
const moonLight = createMoon({ pos: [30, 30, 30], intensity: .1 })

const platform = new Platform({ pos: [0, -10, 0], axis: 'x', range: 29, randomDirChange: true })
const stars = new Stars({ minRadius: 150 })

const jupiter = createJupiter({ r: 5 })
jupiter.position.set(-125, 25, -80)

const moon = createSphere({ r: 1.5, file: 'planets/moon.jpg' })

const saturn = createSaturn({ r: 3 })
saturn.position.set(85, 20, -50)

scene.add(platform.mesh, stars.mesh, jupiter, saturn, moon, moonLight)

const score = new Score({ subtitle: 'Fuel left', shouldBlink: false })
score.renderTempText('Land on the platform gently')

/* LOOP */

let time = 0

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
  if (!lander) return

  const dt = clock.getDelta()
  platform.update(dt)
  lander.update(dt)

  score.points = lander.hasLanded ? lander.fuel : 0

  stars.update({ delta: dt * .005 })
  arcology?.rotateY(dt * .02)
  jupiter.rotateY(dt * .2)
  moon.rotateY(dt)
  orbitAround({ moon, planet: jupiter, time: time += dt * .75 })

  score.render(score.points, lander.fuel)

  if (lander.endText) {
    score.renderText(lander.endText + '<br><br><small>press R to play again</small>')
    if (lander.input.pressed.KeyR) {
      lander.reset()
      score.clear()
    }
  }
}()

/* LAZY LOAD */

arcology = await loadModel({ file: 'space/arcology-ring/model.fbx', scale: .5, shouldCenter: true })
arcology.position.z = -100
scene.add(arcology)

const obj = await import('./Lander.js')
lander = new obj.default({ platform })
scene.add(lander.mesh)
