import {scene, camera, renderer, createOrbitControls} from '../utils/three-scene.js'
import terrainFromHeightmap from '../utils/terrainFromHeightmap.js'

createOrbitControls()

terrainFromHeightmap(
  '../assets/heightmaps/oos-heightmap-128.jpg', mesh => {
    scene.add(mesh)
  },
  undefined,
  undefined,
  // '../../assets/heightmaps/oos-terrain.jpg'
)

/* INIT */

void function update() {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
