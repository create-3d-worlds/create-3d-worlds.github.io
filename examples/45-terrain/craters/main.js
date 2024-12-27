import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { createCraters } from '/core/ground.js'

camera.position.set(0, 20, 20)
createOrbitControls()

const terrain = await createCraters()
scene.add(terrain)

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()