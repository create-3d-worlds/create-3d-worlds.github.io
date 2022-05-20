import { scene, camera, renderer } from '/utils/scene.js'
import { createParticles } from '/utils/particles.js'

camera.position.z = 500

const stars = createParticles({ file: 'star.png' })
scene.add(stars)

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  camera.position.z -= .3
  renderer.render(scene, camera)
}()
