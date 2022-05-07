import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { initLights, hemLight } from '/utils/light.js'
import { createBuilding } from '/utils/city.js'

initLights()
hemLight()

const controls = createOrbitControls()
camera.position.set(0, 75, 75)
renderer.setClearColor(0x070b34)

scene.add(createBuilding())

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
