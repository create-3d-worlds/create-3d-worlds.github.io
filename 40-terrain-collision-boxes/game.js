import {scene, camera, renderer, clock} from '../utils/scene.js'
import {createBlock} from '../utils/boxes.js'
import {createTerrain} from '../utils/floor.js'
import Avatar from '../classes/Avatar.js'

const terrain = createTerrain()
scene.add(terrain)

const boxes = new THREE.Group
const radius = 100

for (let i = 0; i < 100; i += 1) {
  const step = i / 5
  const x = Math.cos(step) * radius
  const z = Math.sin(step) * radius
  const block = createBlock(x, i * 8, z)
  block.rotateY(Math.cos(step))
  boxes.add(block)
}

scene.add(boxes)

camera.position.z = 50
camera.position.y = 15

const avatar = new Avatar(25, 0, 25, 10)
avatar.add(camera)
avatar.addGround(terrain)
avatar.addGround(boxes)
avatar.addSurrounding(boxes)
scene.add(avatar.mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
