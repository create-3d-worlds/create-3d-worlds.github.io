import {scene, camera, renderer, createOrbitControls} from '/utils/scene.js'
import terrainFromHeightmap from '/utils/terrainFromHeightmap.js'

createOrbitControls()
camera.position.y = 150

terrainFromHeightmap('/assets/heightmaps/wiki.png', mesh => {
  scene.add(mesh)
})

/* LOOP */

void function update() {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
