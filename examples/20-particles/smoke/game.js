import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'
import { Smoke } from '/utils/classes/Particles.js'

createOrbitControls()
hemLight()

const particles = new Smoke()
scene.add(particles.mesh)

/* LOOP */

void function loop() {
  particles.update()
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()
