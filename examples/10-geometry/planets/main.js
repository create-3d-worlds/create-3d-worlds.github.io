import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createSphere } from '/utils/geometry.js'
import { createEarth, createSaturn } from '/utils/geometry/planets.js'
import { dirLight } from '/utils/light.js'

dirLight({ pos: [100, 10, -50] })
renderer.setClearColor(0x000000)

const controls = createOrbitControls()

const earth = createEarth({ r: 5 })
earth.translateX(-10)
scene.add(earth)

const saturn = createSaturn()
saturn.translateX(10)
scene.add(saturn)

const moon = createSphere({ r: .5, file: 'planets/moon.jpg' })
moon.position.set(-1.2, .5, 0)
scene.add(moon)

/* LOOP */

const rotationSpeed = 0.001

void function render() {
  controls.update()

  earth.rotation.y += rotationSpeed

  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
