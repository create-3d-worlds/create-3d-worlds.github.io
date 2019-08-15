import { scene, camera, renderer, createOrbitControls } from '../utils/three-scene.js'
import {createTerrain, createBox} from '../utils/three-helpers.js'

scene.add(createTerrain())
scene.add(createBox())

const controls = createOrbitControls()
camera.position.y = 50
camera.position.z = 50

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
