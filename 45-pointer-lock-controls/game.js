import { PointerLockControls } from '../node_modules/three/examples/jsm/controls/PointerLockControls.js'
import { scene, camera, renderer, clock } from '../utils/3d-scene.js'
import {createTerrain, createRandomCubes} from '../utils/3d-helpers.js'
import keyboard from '../classes/Keyboard.js'

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
light.position.set(0.5, 1, 0.75)
scene.add(light)

const controls = new PointerLockControls(camera)
scene.add(controls.getObject())
const cubes = createRandomCubes()
scene.add(cubes)

scene.add(createTerrain())

const velocity = new THREE.Vector3()

function updateControls() {
  const mesh = controls.getObject()
  const delta = clock.getDelta()
  velocity.x -= velocity.x * 10.0 * delta
  velocity.z -= velocity.z * 10.0 * delta
  velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass
  if (keyboard.pressed.KeyW) velocity.z -= 400.0 * delta
  if (keyboard.pressed.KeyS) velocity.z += 400.0 * delta
  if (keyboard.pressed.KeyA) velocity.x -= 400.0 * delta
  if (keyboard.pressed.KeyD) velocity.x += 400.0 * delta
  if (keyboard.pressed.Space) velocity.y += 2000 * delta
  
  mesh.translateX(velocity.x * delta)
  mesh.translateY(velocity.y * delta)
  mesh.translateZ(velocity.z * delta)
  if (mesh.position.y < 10) {
    velocity.y = 0
    mesh.position.y = 10
  }
}

void function animate() {
  requestAnimationFrame(animate)
  updateControls()
  renderer.render(scene, camera)
}()

/* EVENTS */

document.body.addEventListener('click', document.body.requestPointerLock)
