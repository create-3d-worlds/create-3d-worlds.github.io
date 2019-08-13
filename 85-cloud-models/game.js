import { scene, renderer, camera, createOrbitControls} from '../utils/three-scene.js'
import { createWater} from '../utils/three-helpers.js'
import { roll } from '../utils/helpers.js'
import '../node_modules/three/examples/js/loaders/deprecated/LegacyJSONLoader.js'

const loader = new THREE.LegacyJSONLoader()
loader.load('../assets/models/cloud.json', (geometry, materials) => {
  const mesh = new THREE.Mesh(geometry, materials)
  mesh.scale.set(roll(50) + 10, 15, roll(10) + 10)
  mesh.castShadow = true
  scene.add(mesh)
})

createOrbitControls()
camera.position.y = 250
camera.position.z = 250

scene.add(createWater(1000))

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
