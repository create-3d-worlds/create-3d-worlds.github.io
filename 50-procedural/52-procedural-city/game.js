// TODO: change roof color or texture
import * as THREE from '/node_modules/three/build/three.module.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createFloor } from '/utils/floor.js'
import { generateCity } from '/utils/city.js'
import {FirstPersonControls} from '/node_modules/three/examples/jsm/controls/FirstPersonControls.js'

const size = 100

camera.position.set(80, 80, 80)
const controls = new FirstPersonControls(camera)
controls.movementSpeed = 20
controls.lookSpeed = 0.05

scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)
scene.add(createFloor(size * 2, null, 0x101018))

scene.add(generateCity(size, false))

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  controls.update(delta)
  renderer.render(scene, camera)
}()
