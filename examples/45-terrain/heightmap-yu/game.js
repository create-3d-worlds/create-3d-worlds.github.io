import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { terrainFromHeightmap } from '/core/terrain/heightmap.js'
import { hemLight, dirLight } from '/core/light.js'

hemLight()
dirLight()

const controls = await createOrbitControls()
camera.position.y = 200

const terrain = await terrainFromHeightmap({ file: 'yu.png' })
scene.add(terrain)

/* LOOP */

void function update() {
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(update)
}()
