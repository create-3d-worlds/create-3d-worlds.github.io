import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createWater } from '/utils/ground/index.js'
import texturedFromHeightmap from '/utils/ground/texturedFromHeightmap.js'

createOrbitControls()
camera.position.y = 150

scene.add(texturedFromHeightmap('/assets/heightmaps/stemkoski.png'))
scene.add(createWater(1000, 0.60, 'water512.jpg'))

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
