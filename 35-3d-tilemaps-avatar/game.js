import { createFloor, createMap, createTrees } from '../utils/3d-helpers.js'
import { scene, renderer, camera, createOrbitControls } from '../utils/3d-scene.js'
import Avatar from '../classes/Avatar.js'

import matrix from '../data/small-map.js'

const avatar = new Avatar()
scene.add(avatar.mesh)
scene.add(createFloor(500, 500, 'ground.jpg'))
scene.add(createMap(matrix, 20))
// scene.add(createTrees())

camera.position.z = 500
// avatar.mesh.add(camera)
const controls = createOrbitControls()

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  avatar.update()
  renderer.render(scene, camera)
}()
