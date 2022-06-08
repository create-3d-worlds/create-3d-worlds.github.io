/* global dat */
import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { DEGREE } from '/utils/constants.js'
import { createAirplane } from '/utils/shapes.js'

/* INIT */

createOrbitControls()

camera.position.set(0, 100, -150)
camera.lookAt(scene.position)

const light = new THREE.DirectionalLight(0xFFFFFF, 1.0)
light.position.set(-10, 10, 0)
scene.add(light)

const airplane = createAirplane()
scene.add(airplane)

const gui = new dat.GUI()
const controller = { x: 0, y: 0, z: 0 }
gui.add(controller, 'x', -360, 360).name('Rotate x (pitch)')
gui.add(controller, 'y', -360, 360).name('Rotate y (yaw)')
gui.add(controller, 'z', -360, 360).name('Rotate z (roll)')

/* LOOP */

void function update() {
  window.requestAnimationFrame(update)
  airplane.rotation.x = controller.x * DEGREE // pitch
  airplane.rotation.y = controller.y * DEGREE // yaw
  airplane.rotation.z = controller.z * DEGREE // roll
  renderer.render(scene, camera)
}()
