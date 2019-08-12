import { scene, camera, renderer, clock, createOrbitControls } from '../utils/three-scene.js'
import {createTerrain, createFirs} from '../utils/three-helpers.js'
import Avatar from '../classes/Avatar.js'

const size = 1000

const avatar = new Avatar()
scene.add(avatar.mesh)

const terrain = createTerrain(size, size)
scene.add(terrain)
scene.add(createFirs(50, size, terrain))

const controls = createOrbitControls()
camera.position.y = 200
camera.position.z = 200

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta, null, terrain)
  controls.update()
  renderer.render(scene, camera)
}()
