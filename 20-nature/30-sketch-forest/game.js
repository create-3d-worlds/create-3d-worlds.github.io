import { createWorldScene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createSketchTrees } from '/utils/trees.js'

const scene = createWorldScene()
const controls = createOrbitControls()

camera.position.z = 20
camera.position.y = 10

scene.add(createSketchTrees())

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
