import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createDunes } from '/utils/ground.js'
import { createSun } from '/utils/light.js'

scene.add(createSun())

camera.position.set(0, 20, 20)
createOrbitControls()

const terrain = createDunes()
scene.add(terrain)

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()