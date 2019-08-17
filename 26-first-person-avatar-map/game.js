import { PointerLockControls } from '../node_modules/three/examples/jsm/controls/PointerLockControls.js'
import { createFloor } from '../utils/floor.js'
import { createMap } from '../utils/shapes.js'
import { scene, renderer, camera, clock } from '../utils/scene.js'
import Avatar from '../classes/Avatar.js'
import keyboard from '../classes/Keyboard.js'
import matrix from '../data/small-map.js'

new PointerLockControls(camera)

const avatar = new Avatar(25, 25, 0.1)
scene.add(avatar.mesh)
scene.add(createFloor())
scene.add(createMap(matrix, 20))

camera.position.z = 100
avatar.mesh.add(camera)

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  if (keyboard.totalPressed) camera.lookAt(avatar.mesh.position)
  renderer.render(scene, camera)
}()

/* EVENTS */

document.body.addEventListener('click', document.body.requestPointerLock)

document.addEventListener('pointerlockchange', () => {
  if (!document.pointerLockElement) camera.lookAt(avatar.mesh.position)
})
