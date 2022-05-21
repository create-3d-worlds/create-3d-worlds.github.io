import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createWater } from '/utils/ground.js'
import shaderFromHeightmap from '/utils/ground/shaderFromHeightmap.js'

createOrbitControls()
camera.position.y = 150

scene.add(shaderFromHeightmap('/assets/heightmaps/stemkoski.png'))
scene.add(createWater({ size: 1000, opacity: 0.60, file: 'water512.jpg' }))

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
