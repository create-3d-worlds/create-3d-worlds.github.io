import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { createDunes } from '/core/ground.js'
import { createSun } from '/core/light.js'

scene.add(createSun())

camera.position.set(0, 20, 20)
createOrbitControls()

const terrain = await createDunes()
scene.add(terrain)

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()