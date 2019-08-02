import { scene, camera, renderer, clock } from '../utils/3d-scene.js'
import { createFloor, createPlayerBox } from '../utils/3d-helpers.js'
import keyboard from '../classes/Keyboard.js'

const cameraDistance = [0, 50, 200]
const player = createPlayerBox(0, 0, 50)

scene.add(createFloor(1000, 1000))
scene.add(player)

function update() {
  const delta = clock.getDelta()
  const distance = 200 * delta // 200 pixels per second
  const angle = Math.PI / 2 * delta // 90 degrees per second

  if (keyboard.pressed.KeyW) player.translateZ(-distance)
  if (keyboard.pressed.KeyS) player.translateZ(distance)
  if (keyboard.pressed.KeyA) player.rotateY(angle)
  if (keyboard.pressed.KeyD) player.rotateY(-angle)

  const {x, y, z} = new THREE.Vector3(...cameraDistance).applyMatrix4(player.matrixWorld)
  camera.position.set(x, y, z)
  camera.lookAt(player.position)
}

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  update()
  renderer.render(scene, camera)
}()
