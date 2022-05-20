import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createParticles, expandParticles } from '/utils/particles.js'

createOrbitControls()

const stars = createParticles({ file: 'star.png', num: 10000, size: .5 })
scene.add(stars)

expandParticles({ particles: stars, min: 200, max: 1000 })

/* LOOP */

void function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
