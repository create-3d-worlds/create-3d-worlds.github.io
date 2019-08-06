import { scene, camera, renderer, createOrbitControls } from '../utils/3d-scene.js'
import {createTerrain, createRandomBoxes} from '../utils/3d-helpers.js'

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
light.position.set(0.5, 1, 0.75)
scene.add(light)

const cubes = createRandomBoxes()
scene.add(cubes)

// spustiti tlo (y osu)
scene.add(createTerrain())

const controls = createOrbitControls()
camera.position.y = 75
camera.position.z = 75

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
