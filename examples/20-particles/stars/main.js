import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import Particles from '/utils/classes/Particles.js'

renderer.setClearColor(0x000000)
createOrbitControls()

const particles = new Particles()
scene.add(particles.mesh)

/* LOOP */

void function loop() {
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()
