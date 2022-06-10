import {
  scene, camera, renderer, createOrbitControls, hemLight
} from '/utils/scene.js'
import terrainFromHeightmap from '/utils/ground/terrainFromHeightmap.js'
import { dirLight } from '/utils/light.js'

hemLight()
dirLight()

const controls = createOrbitControls()
camera.position.y = 200

const terrain = terrainFromHeightmap({ textureFile: 'mountain.jpg' })
scene.add(terrain)

/* LOOP */

void function update() {
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(update)
}()
