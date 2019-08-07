import { scene, camera, renderer, clock, createOrbitControls } from '../utils/3d-scene.js'
import {createTerrain, createRandomBoxes} from '../utils/3d-helpers.js'
import Avatar from '../classes/Avatar.js'

const avatar = new Avatar(25, 25, 0.1)
// avatar.add(camera)
scene.add(avatar.mesh)

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 1)
light.position.set(0.5, 1, 0.75)
scene.add(light)

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
