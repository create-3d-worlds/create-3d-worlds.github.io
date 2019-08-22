import {scene, camera, renderer, clock, createOrbitControls} from '../utils/scene.js'
import {createBlock} from '../utils/boxes.js'
import {createTerrain} from '../utils/floor.js'
import Avatar from '../classes/Avatar.js'

const avatar = new Avatar(25, 0, 25, 10)
scene.add(avatar.mesh)

const terrain = createTerrain()
scene.add(terrain)

const boxes = new THREE.Group
const radius = 100

for (let i = 0; i < 100; i += 1) {
  // const time = Date.now() / 1000
  const step = i / 5
  const x = Math.cos(step) * radius
  const z = Math.sin(step) * radius
  const block = createBlock(x, i * 8, z)
  block.rotateY(Math.cos(step))
  boxes.add(block)
}

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
