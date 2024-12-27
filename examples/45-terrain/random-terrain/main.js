import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { createTerrain } from '/core/ground.js'
import { createSun } from '/core/light.js'

scene.add(createSun({ intensity: Math.PI * 2 }))

camera.position.set(0, 10, 20)
createOrbitControls()

const terrain = createTerrain()
scene.add(terrain)

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()