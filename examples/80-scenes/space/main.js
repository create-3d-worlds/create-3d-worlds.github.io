import { scene, camera, renderer, clock, setBackground, createOrbitControls } from '/utils/scene.js'
import { Stars } from '/utils/classes/Particles.js'
import { loadModel } from '/utils/loaders.js'
import { ambLight } from '/utils/light.js'
import { createJupiter, createSaturn, createMoon, orbitAround } from '/utils/geometry/planets.js'

camera.position.set(0, 0, 150)

setBackground(0x000000)
createOrbitControls()
ambLight()

const stars = new Stars()
scene.add(stars.mesh)

const jupiter = createJupiter({ r: 3 })
jupiter.position.set(-150, 8, 0)
scene.add(jupiter)

const moon = createMoon()
moon.position.set(0, 8, 0)
scene.add(moon)

const saturn = createSaturn({ r: 3 })
saturn.position.set(150, 0, 0)
scene.add(saturn)

const { mesh: ring } = await loadModel({ file: 'space/arcology-ring/model.fbx', scale: .5, shouldCenter: true })
ring.translateY(1)
scene.add(ring)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  const time = clock.getElapsedTime()
  ring.rotateY(dt * .02)

  jupiter.rotation.y += dt * .2
  moon.rotation.y -= dt

  orbitAround({ moon, planet: jupiter, time: time * .5, radiusX: 15, radiusZ: 20 })

  renderer.render(scene, camera)
}()
