import { scene, renderer, camera, createOrbitControls } from '/core/scene.js'
import { terrainFromHeightmap } from '/core/terrain/heightmap.js'

createOrbitControls()
camera.position.y = 150

const terrain = await terrainFromHeightmap({ file: 'europe.png', heightFactor: 30, snow: false })
scene.add(terrain)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
