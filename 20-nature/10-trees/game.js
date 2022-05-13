import { createWorldScene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createTree, createSketchTree, createFirTree } from '/utils/trees.js'

const scene = createWorldScene()
createOrbitControls()

camera.position.z = 20
camera.position.y = 10

scene.add(
  createTree({ x: -15 }),
  createSketchTree(),
  createFirTree({ x: 15 }),
)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  // controls.update()
  renderer.render(scene, camera)
}()
