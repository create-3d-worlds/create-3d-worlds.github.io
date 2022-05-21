import { scene, camera, renderer, hemLight } from '/utils/scene.js'
import { createSnow, addVelocity, updateRain } from '/utils/particles.js'

hemLight()

const snow = createSnow()
scene.add(snow)

addVelocity({ particles: snow, min: 0.5, max: 3 })

/* LOOP */

void function animate() {
  updateRain({ particles: snow, minY: -300, maxY: 300 })
  snow.rotateY(.003)
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
