import {scene, renderer, camera, clock, createOrbitControls} from '../utils/three-scene.js'
import {createTreesOnTerrain, createWater} from '../utils/three-helpers.js'
import {createHillyTerrain} from '../utils/createHillyTerrain.js'
import Avatar from '../classes/Avatar.js'

const avatar = new Avatar()
scene.add(avatar.mesh)

createOrbitControls()
camera.position.y = 150

scene.add(createWater(1000))
const land = createHillyTerrain()
scene.add(land)
scene.add(createTreesOnTerrain(land))

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta, null, land)
  renderer.render(scene, camera)
}()
