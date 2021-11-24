import {scene, camera, renderer, createOrbitControls} from '/utils/scene-day.js'
import terrainFromHeightmap from '/utils/terrainFromHeightmap.js'

createOrbitControls()
camera.position.y = 150

terrainFromHeightmap(
  '/assets/heightmaps/oos-heightmap-128.jpg',
  mesh => {
    scene.add(mesh)
  },
  '/assets/heightmaps/oos-terrain.jpg',
  3
)

/* LOOP */

void function update() {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
