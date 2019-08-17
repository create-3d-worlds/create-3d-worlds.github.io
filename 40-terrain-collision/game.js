import { scene, camera, renderer, clock, createOrbitControls } from '../utils/scene.js'
import {createRandomBoxes} from '../utils/shapes.js'
import {createTerrain} from '../utils/floor.js'
import Avatar from '../classes/Avatar.js'

const avatar = new Avatar(25, 25, 0.1)
scene.add(avatar.mesh)

const terrain = createTerrain()
scene.add(terrain)
const boxes = createRandomBoxes()
scene.add(boxes)

const controls = createOrbitControls()
camera.position.y = 75
camera.position.z = 75

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta, boxes.children, terrain)
  controls.update()
  renderer.render(scene, camera)
}()
