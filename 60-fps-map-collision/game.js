import { createFloor, createMap } from '../utils/3d-helpers.js'
import { scene, renderer, camera, clock } from '../utils/3d-scene.js'
import Avatar from '../classes/Avatar.js'
import keyboard from '../classes/Keyboard.js'
import matrix from '../data/big-map.js'

const avatar = new Avatar(25, 25, 0.1)
scene.add(avatar.mesh)
scene.add(createFloor(500, 500, 'ground.jpg'))
const walls = createMap(matrix, 20)
scene.add(walls)

camera.position.z = 100
avatar.mesh.add(camera)

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta, walls.children)
  if (keyboard.totalPressed) camera.lookAt(avatar.mesh.position)
  renderer.render(scene, camera)
}()
