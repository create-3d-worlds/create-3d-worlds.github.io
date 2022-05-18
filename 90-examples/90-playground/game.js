import { camera, renderer, createWorldScene, createOrbitControls } from '/utils/scene.js'
import { createFir } from '/utils/trees.js'

const scene = createWorldScene()
createOrbitControls()

scene.add(createFir())

/* LOOP */

void function update() {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
