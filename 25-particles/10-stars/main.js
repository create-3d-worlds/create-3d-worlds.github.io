import { scene, camera, renderer, createOrbitControls, hemLight } from '/utils/scene.js'
import { createParticles, moveParticles } from '/utils/particles.js'

createOrbitControls()
hemLight()

const stars = createParticles({ file: 'star.png', num: 10000, color: 0xdddddd, size: .5, unitAngle: .2 })
scene.add(stars)

moveParticles({ particles: stars, min: 500, max: 1000 })

/* LOOP */

void function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
