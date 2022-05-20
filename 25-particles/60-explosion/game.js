import { scene, camera, renderer } from '/utils/scene.js'
import { createParticles, explode, moveParticles } from '/utils/particles.js'
import { mouseToWorld } from '/utils/helpers.js'

const particles = createParticles({ num: 30 })
scene.add(particles)

/* EVENT */

document.addEventListener('click', e => {
  const { x, y, z } = mouseToWorld(e, camera)
  explode({ particles, x, y, z })
})

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  moveParticles({ particles })
  requestAnimationFrame(render)
}()
