import { scene, camera, renderer } from '/utils/scene.js'
import { createParticles, expandParticles } from '/utils/particles.js'

camera.position.z = 500

const stars = createParticles({ file: 'star.png', num: 10000, size: .5 })
scene.add(stars)

expandParticles({ particles: stars, min: 200, max: 1000 })

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  camera.position.z -= .3
  renderer.render(scene, camera)
}()
