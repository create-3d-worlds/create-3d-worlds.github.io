import { createWorldScene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import terrainFromHeightmap from '/utils/ground/terrainFromHeightmap.js'

const scene = createWorldScene({ color: 0x6666ff })

const controls = createOrbitControls()
camera.position.y = 150

const terrain = terrainFromHeightmap({
  src: '/assets/heightmaps/oos-heightmap-128.jpg',
  textureFile: 'oos-terrain.jpg',
  heightOffset: 3
})
scene.add(terrain)

/* LOOP */

void function update() {
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(update)
}()
