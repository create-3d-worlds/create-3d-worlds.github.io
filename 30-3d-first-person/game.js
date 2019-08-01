import {createTree} from '../utils/3d-helpers.js'
import {scene, renderer, camera} from '../utils/3d-scene.js'
import keyboard from '../classes/Keyboard.js'
import Avatar from '../classes/Avatar.js'

const container = new THREE.Object3D()
scene.add(container)

camera.position.z = 500
container.add(camera)

const avatar = new Avatar()
container.add(avatar.mesh)

/* FUNCTIONS */

function updateContainer() {
  const {pressed} = keyboard
  if (pressed.ArrowLeft) container.position.x -= 10
  if (pressed.ArrowRight) container.position.x += 10
  if (pressed.ArrowUp) container.position.z -= 10
  if (pressed.ArrowDown) container.position.z += 10
  // if (pressed.KeyA) camera.position.x += 10
  // if (pressed.KeyD) camera.position.x -= 10
}

/* INIT */

[[500, 0], [-500, 0], [300, -200], [-200, -800], [-750, -1000], [500, -1000]]
  .map(pos => scene.add(createTree(...pos)))

void function animate() {
  requestAnimationFrame(animate)
  updateContainer()
  avatar.update()
  renderer.render(scene, camera)
}()
