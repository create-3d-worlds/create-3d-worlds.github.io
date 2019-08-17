import { createFloor } from '../utils/floor.js'
import { createMap } from '../utils/shapes.js'
import { scene, renderer, camera, clock, createOrbitControls } from '../utils/scene.js'
import Avatar from '../classes/Avatar.js'
import matrix from '../data/small-map.js'

const controls = createOrbitControls()
camera.position.y = 250

const avatar = new Avatar(25, 25, 0.1)
scene.add(avatar.mesh)
scene.add(createFloor())
scene.add(createMap(matrix, 20))

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  controls.update()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
