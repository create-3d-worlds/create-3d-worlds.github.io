import { scene, camera, renderer, createOrbitControls } from '../utils/three-scene.js'
import {createTerrain, createRandomBoxes} from '../utils/three-helpers.js'

scene.add(createTerrain())
scene.add(createRandomBoxes())

const controls = createOrbitControls()
camera.position.y = 75
camera.position.z = 75

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
