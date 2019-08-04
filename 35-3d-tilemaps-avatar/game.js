import { createFloor, createMap } from '../utils/3d-helpers.js'
import { scene, renderer, camera, clock, createOrbitControls } from '../utils/3d-scene.js'
import Avatar from '../classes/Avatar.js'

import matrix from '../data/small-map.js'

const avatar = new Avatar(25, 25, 0.1)
scene.add(avatar.mesh)
scene.add(createFloor(500, 500, 'ground.jpg'))
scene.add(createMap(matrix, 20))

camera.position.z = 500
avatar.mesh.add(camera)
const controls = createOrbitControls()

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  controls.update()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
