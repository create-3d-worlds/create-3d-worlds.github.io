import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import Particles from '/core/Particles.js'

renderer.setClearColor(0x000000)
createOrbitControls()

const particles = new Particles()
scene.add(particles.mesh)

/* LOOP */

void function loop() {
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()
