import { scene, camera, renderer, createOrbitControls } from '../utils/3d-scene.js'
import {createTerrain, createRandomCubes} from '../utils/3d-helpers.js'

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
light.position.set(0.5, 1, 0.75)
scene.add(light)

const cubes = createRandomCubes()
scene.add(cubes)

scene.add(createTerrain())

const controls = createOrbitControls()

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
