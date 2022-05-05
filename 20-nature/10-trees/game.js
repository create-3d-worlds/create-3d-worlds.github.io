import { createWorldScene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createTree, createSketchTree, createFirTree } from '/utils/trees.js'

const scene = createWorldScene()
const controls = createOrbitControls()

camera.position.y = 100

scene.add(
  createTree({ x: -150 }),
  createSketchTree(),
  createFirTree({ x: 150 }),
)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
