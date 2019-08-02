/* global THREEx */
import { scene, camera, renderer, clock } from '../utils/3d-scene.js'
import { createFloor, createPlayerBox } from '../utils/3d-helpers.js'

const keyboard = new THREEx.KeyboardState()
scene.add(createFloor(1000, 1000))
const cube = createPlayerBox(0, 0, 50)
scene.add(cube)

function update() {
  const delta = clock.getDelta()
  const moveDistance = 200 * delta // 200 pixels per second
  const rotateAngle = Math.PI / 2 * delta // 90 degrees per second
  // move
  if (keyboard.pressed('W')) cube.translateZ(-moveDistance)
  if (keyboard.pressed('S')) cube.translateZ(moveDistance)
  if (keyboard.pressed('Q')) cube.translateX(-moveDistance)
  if (keyboard.pressed('E')) cube.translateX(moveDistance)
  // rotate
  if (keyboard.pressed('A')) cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle)
  if (keyboard.pressed('D')) cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle)
  if (keyboard.pressed('R')) cube.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle)
  if (keyboard.pressed('F')) cube.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle)
  // reset
  if (keyboard.pressed('Z')) {
    cube.position.set(0, 25.1, 0)
    cube.rotation.set(0, 0, 0)
  }

  const relativeCameraOffset = new THREE.Vector3(0, 50, 200)
  const cameraOffset = relativeCameraOffset.applyMatrix4(cube.matrixWorld)
  camera.position.x = cameraOffset.x
  camera.position.y = cameraOffset.y
  camera.position.z = cameraOffset.z
  camera.lookAt(cube.position)
}

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  update()
  renderer.render(scene, camera)
}()
