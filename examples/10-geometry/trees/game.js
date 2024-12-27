import { scene, renderer, camera, createOrbitControls } from '/core/scene.js'
import { createTree, createFirTree, createSimpleFir } from '/core/geometry/trees.js'
import { createGround } from '/core/ground.js'
import { createSun } from '/core/light.js'

scene.add(createGround())
const sun = createSun()
scene.add(sun)

createOrbitControls()
camera.position.z = 20
camera.position.y = 10

scene.add(
  createSimpleFir({ x: -15 }),
  createTree(),
  createFirTree({ x: 15 }),
)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
