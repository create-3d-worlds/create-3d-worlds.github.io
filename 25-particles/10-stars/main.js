import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createParticles } from '/utils/particles.js'

createOrbitControls()

const stars = createParticles()
scene.add(stars)

/* LOOP */

void function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
