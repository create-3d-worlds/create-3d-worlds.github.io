import { scene, camera, renderer } from '/utils/scene.js'
import { mouseToWorld } from '/utils/helpers.js'
import { Explosion } from '/utils/classes/Particles.js'

renderer.setClearColor(0x000000)

const explosion = new Explosion()
scene.add(explosion.mesh)

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  explosion.expand({ velocity: 1.1 })
  requestAnimationFrame(render)
}()

/* EVENT */

document.addEventListener('click', e => {
  const { x, y, z } = mouseToWorld(e, camera)
  explosion.reset({ pos: [x, y, z], unitAngle: 0.1 })
})