import { createWorld, renderer, camera, hemLight, createOrbitControls } from '/utils/scene.js'
import { createTree, createSimpleTree, createSketchTree, createFirTree } from '/utils/trees.js'
import { randomInRange } from '/utils/helpers.js'

const scene = createWorld()

hemLight()
createOrbitControls()

camera.position.z = 100
camera.position.y = 50

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
  renderer.render(scene, camera)
}()
