import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { createBuilding } from '/core/city.js'
import { createMoon } from '/core/light.js'

const controls = await createOrbitControls()
camera.position.set(0, 25, 50)
renderer.setClearColor(0x070b34)

scene.add(createBuilding({ addWindows: true }))
scene.add(createMoon({ pos: [50, 50, 50], r: 1 }))

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  controls.update()
  renderer.render(scene, camera)
}()
