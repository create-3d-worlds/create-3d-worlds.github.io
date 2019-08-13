import {scene, renderer, camera, createOrbitControls} from '../utils/three-scene.js'
import { createFirs, createWater, createHillyTerrain} from '../utils/three-helpers.js'

createOrbitControls()
camera.position.y = 250
camera.position.z = 250

scene.add(createWater(1000))
const land = createHillyTerrain(1000, 30)
scene.add(land)
scene.add(createFirs(land))

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
