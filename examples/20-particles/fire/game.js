import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'
import { Fire } from '/utils/Particles.js'

createOrbitControls()
hemLight()

const particles = new Fire()
scene.add(particles.mesh)

/* LOOP */

void function loop() {
  particles.update()

  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()
