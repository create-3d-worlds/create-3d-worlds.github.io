import { scene, camera, renderer, clock, createOrbitControls } from '../utils/three-scene.js'
import {createTerrain, createRandomBoxes} from '../utils/three-helpers.js'
import Avatar from '../classes/Avatar.js'

const avatar = new Avatar(25, 25, 0.1)
scene.add(avatar.mesh)

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 1)
light.position.set(0.5, 1, 0.75)
scene.add(light)

const terrain = createTerrain()
scene.add(terrain)

const controls = createOrbitControls()
camera.position.y = 75
camera.position.z = 75

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta, null, terrain)
  controls.update()
  renderer.render(scene, camera)
}()
