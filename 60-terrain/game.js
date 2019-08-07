import { scene, camera, renderer, createOrbitControls } from '../utils/three-scene.js'
import {createTerrain, createRandomBoxes} from '../utils/three-helpers.js'

// const light = new THREE.HemisphereLight(0xffffbb, 0xddddaa, 0.99)
const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 1)
light.position.set(0.5, 1, 0.75)
scene.add(light)

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
