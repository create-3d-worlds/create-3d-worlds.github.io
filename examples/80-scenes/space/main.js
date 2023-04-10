import { scene, camera, renderer, clock, setBackground, createOrbitControls } from '/utils/scene.js'
import { Stars } from '/utils/classes/Particles.js'
import { loadModel } from '/utils/loaders.js'
import { ambLight } from '/utils/light.js'
import { createJupiter, createSaturn, createMoon, orbitAround } from '/utils/geometry/planets.js'

camera.position.set(0, 0, 150)

setBackground(0x000000)
createOrbitControls()
ambLight()

const stars = new Stars({ minRadius: 150 })
scene.add(stars.mesh)

const jupiter = createJupiter({ r: 5 })
jupiter.position.set(-150, 8, 0)
scene.add(jupiter)

const moon = createMoon()
moon.position.set(0, 8, 0)
scene.add(moon)

const saturn = createSaturn({ r: 3 })
saturn.position.set(150, 0, 0)
scene.add(saturn)

const { mesh: arcology } = await loadModel({ file: 'space/arcology-ring/model.fbx', scale: .5, shouldCenter: true })
arcology.translateY(1)
scene.add(arcology)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  const time = clock.getElapsedTime()

  arcology.rotateY(dt * .02)
  jupiter.rotateY(dt * .2)
  saturn.rotateY(dt * -.2)
  moon.rotateY(dt)

  orbitAround({ moon, planet: jupiter, time: time * .5, radiusX: 15, radiusZ: 20 })
  stars.update({ delta: dt * .001 })

  renderer.render(scene, camera)
}()
