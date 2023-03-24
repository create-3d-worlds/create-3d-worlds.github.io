import { scene, camera, renderer } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'
import { Rain } from '/utils/classes/Particles.js'

hemLight()
renderer.setClearColor(0x000000)

const particles = new Rain({ color: 0x9999ff, size: 1, minRadius: 5, maxRadius: 100 })
scene.add(particles.mesh)

/* LOOP */

void function loop() {
  particles.update({ minVelocity: 120, maxVelocity: 240, min: -100, max: 200 })
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()
