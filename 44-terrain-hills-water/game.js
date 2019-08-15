import { scene, renderer, camera, clock, createOrbitControls} from '../utils/three-scene.js'
import { createFirs, createWater, createHillyTerrain} from '../utils/three-helpers.js'
import Avatar from '../classes/Avatar.js'

const avatar = new Avatar()
scene.add(avatar.mesh)

createOrbitControls()
camera.position.y = 150

scene.add(createWater(1000))
const land = createHillyTerrain(1000, 30)
scene.add(land)
scene.add(createFirs(land))

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta, null, land)
  renderer.render(scene, camera)
}()
