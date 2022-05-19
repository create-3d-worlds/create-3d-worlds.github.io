import { scene, camera, renderer } from '/utils/scene.js'
import { createParticles, explode, updateExplosion } from '/utils/particles.js'
import { mouseToWorld } from '/utils/helpers.js'

camera.position.set(5, 5, 3)

const particles = createParticles({ num: 30 })
scene.add(particles)

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  updateExplosion({ particles })
  requestAnimationFrame(render)
}()

/* EVENTS */

document.addEventListener('click', e => {
  const pos = mouseToWorld(e, camera)
  explode({ particles, ...pos })
})