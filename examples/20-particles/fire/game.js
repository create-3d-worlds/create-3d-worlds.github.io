import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { hemLight } from '/core/light.js'
import { Fire } from '/core/Particles.js'

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
