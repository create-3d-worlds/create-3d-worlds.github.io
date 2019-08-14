import {scene, camera, renderer, createOrbitControls} from '../utils/three-scene.js'
import terrainFromHeightmap from '../utils/terrainFromHeightmap.js'

createOrbitControls()

terrainFromHeightmap('../assets/heightmaps/wiki.png', mesh => {
  scene.add(mesh)
})

/* INIT */

void function update() {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
