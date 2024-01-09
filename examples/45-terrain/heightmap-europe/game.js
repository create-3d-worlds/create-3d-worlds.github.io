import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { terrainFromHeightmap } from '/utils/terrain/heightmap.js'

createOrbitControls()
camera.position.y = 150

const terrain = await terrainFromHeightmap({ file: 'europe.png', heightFactor: 30, snow: false })
scene.add(terrain)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
