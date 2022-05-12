import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import Snow from '/classes/nature/Snow.js'

createOrbitControls()

const snow = new Snow({ size: 1000, flakesNum: 10000 })
scene.add(...snow.layers)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  snow.update()
  renderer.render(scene, camera)
}()
