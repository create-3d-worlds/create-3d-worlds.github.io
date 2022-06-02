import { scene, camera, renderer, hemLight } from '/utils/scene.js'
import { createSnow, addVelocity, updateSnow } from '/utils/particles.js'

hemLight()
renderer.setClearColor(0x000000)

const snow = createSnow()
scene.add(snow)

addVelocity({ particles: snow, min: 0.5, max: 3 })

/* LOOP */

void function animate() {
  updateSnow({ particles: snow, minY: -300, maxY: 300 })
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
