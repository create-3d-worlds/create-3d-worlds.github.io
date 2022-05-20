import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createStars } from '/utils/particles.js'

createOrbitControls()

const stars = createStars()
scene.add(stars)

/* LOOP */

void function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
