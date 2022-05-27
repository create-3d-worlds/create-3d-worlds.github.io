import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createEarth, createEarthClouds } from '/utils/planets.js'
import { dirLight } from '/utils/light.js'

dirLight({ position: [100, 10, -50] })

const rotationSpeed = 0.001

const controls = createOrbitControls()
camera.position.set(40, 0, 0)

const earth = createEarth()
const clouds = createEarthClouds()
scene.add(earth, clouds)

/* LOOP */

void function render() {
  controls.update()

  earth.rotation.y += rotationSpeed
  clouds.rotation.y += rotationSpeed * 1.1

  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
