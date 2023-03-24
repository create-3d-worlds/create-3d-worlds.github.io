import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createCraters } from '/utils/ground.js'

camera.position.set(0, 20, 20)
createOrbitControls()

const terrain = createCraters()
scene.add(terrain)

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()