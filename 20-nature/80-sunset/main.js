import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createSunSky } from '/utils/sky.js'

createOrbitControls()
scene.add(createSunSky())

void function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()