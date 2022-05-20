import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createParticles, setOrientation, moveParticles } from '/utils/particles.js'

createOrbitControls()

const stars = createParticles({ file: 'star.png', num: 10000, size: .5 })
scene.add(stars)

setOrientation({ particles: stars })

moveParticles({ particles: stars, min: 200, max: 1000 })

/* LOOP */

void function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
