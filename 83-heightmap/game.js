import {scene, camera, renderer, createOrbitControls} from '../utils/three-scene.js'
import meshFromHeightmap from '../utils/meshFromHeightmap.js'

createOrbitControls()

const light = new THREE.DirectionalLight()
light.position.set(1200, 1200, 1200)
scene.add(light)

meshFromHeightmap('../assets/heightmaps/wiki.png', mesh => {
  scene.add(mesh)
})

/* INIT */

void function update() {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
