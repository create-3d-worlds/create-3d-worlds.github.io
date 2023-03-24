import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'
import { Rain } from '/utils/classes/Particles.js'

createOrbitControls()
hemLight()

const particles = new Rain({ file: 'fire.png', size: 30, num: 100, minRadius: 1.5, maxRadius: 3, color: 0xffffff })
particles.mesh.rotateX(Math.PI)
scene.add(particles.mesh)

/* LOOP */

void function loop() {
  particles.update({ rotateY: .009, min: -8, max: 4, minVelocity: 1.5, maxVelocity: 5 })

  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()
