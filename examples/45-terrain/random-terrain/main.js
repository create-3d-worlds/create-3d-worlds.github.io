import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createTerrain } from '/utils/ground.js'
import { createSun } from '/utils/light.js'

scene.add(createSun())

camera.position.set(0, 10, 20)
createOrbitControls()

const terrain = createTerrain()
scene.add(terrain)

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()