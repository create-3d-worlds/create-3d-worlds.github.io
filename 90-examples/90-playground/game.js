import { camera, renderer, createWorldScene } from '/utils/scene.js'
import { createFir } from '../30-endless-runner/helpers/createTree.js'

const scene = createWorldScene()

scene.add(createFir())

/* LOOP */

void function update() {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
