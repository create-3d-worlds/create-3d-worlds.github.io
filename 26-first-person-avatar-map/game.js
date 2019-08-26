import { createFloor } from '../utils/floor.js'
import { createMap } from '../utils/boxes.js'
import { scene, renderer, camera, clock } from '../utils/scene.js'
import Avatar from '../classes/Avatar.js'
import matrix from '../data/small-map.js'

const avatar = new Avatar(25, 0, 25, 10)
scene.add(avatar.mesh)
scene.add(createFloor())
scene.add(createMap(matrix, 20))

camera.position.z = 20
camera.position.y = 15
avatar.mesh.add(camera)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()