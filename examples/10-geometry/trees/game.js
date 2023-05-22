import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createTree, createFirTree, createSimpleFir } from '/utils/geometry/trees.js'
import { createGround } from '/utils/ground.js'
import { createSun } from '/utils/light.js'

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
