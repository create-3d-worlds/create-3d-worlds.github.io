import { createWorldScene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createTree, createSimpleTree, createSketchTree, createFirTree } from '/utils/trees.js'
import { randomInRange } from '/utils/helpers.js'

const scene = createWorldScene()
const controls = createOrbitControls()

camera.position.y = 100

const r = () => randomInRange(-200, 200)

scene.add(
  createTree({ x: r(), z: r() }),
  createSimpleTree({ x: r(), z: r() }),
  createSketchTree({ x: r(), z: r() }),
  createFirTree({ x: r(), z: r() }),
)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
