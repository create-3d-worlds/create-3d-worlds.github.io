import { createFullScene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import terrainFromHeightmap from '/utils/terrainFromHeightmap.js'

const scene = createFullScene({ color: 0x6666ff })
createOrbitControls()
camera.position.y = 150

terrainFromHeightmap(
  '/assets/heightmaps/oos-heightmap-128.jpg',
  mesh => {
    scene.add(mesh)
    mesh.position.y = -10
  },
  '/assets/heightmaps/oos-terrain.jpg',
  3
)

/* LOOP */

void function update() {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
