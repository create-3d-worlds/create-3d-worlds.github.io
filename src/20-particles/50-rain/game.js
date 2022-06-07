import { scene, camera, renderer, hemLight } from '/utils/scene.js'
import { createRain, addVelocity, updateRain } from '/utils/particles.js'

hemLight()
renderer.setClearColor(0x000000)

const rain = createRain()
scene.add(rain)

addVelocity({ particles: rain, min: 0.5, max: 3 })

/* LOOP */

void function animate() {
  updateRain({ particles: rain, minY: -300, maxY: 300 })
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}()
