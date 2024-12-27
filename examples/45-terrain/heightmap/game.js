import { scene, renderer, camera, createOrbitControls } from '/core/scene.js'
import { terrainFromHeightmap } from '/core/terrain/heightmap.js'
import { hemLight } from '/core/light.js'

hemLight()
createOrbitControls()
camera.position.y = 150

const terrain = await terrainFromHeightmap({ file: 'wiki.png', seaLevel: 0.05 })
scene.add(terrain)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
