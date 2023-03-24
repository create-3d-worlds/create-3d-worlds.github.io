import { createWorldScene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createTree, createFirTree, createFir, createSimpleFir } from '/utils/geometry/trees.js'

const scene = createWorldScene()
createOrbitControls()

camera.position.z = 20
camera.position.y = 10

scene.add(
  createSimpleFir({ x: -30 }),
  createTree({ x: -15 }),
  createFirTree({ x: 15 }),
  createFir({ x: 30 }),
)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
