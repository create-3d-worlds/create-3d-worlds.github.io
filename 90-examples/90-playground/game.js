import { camera, renderer, createWorldScene } from '/utils/scene.js'

const scene = createWorldScene()

/* LOOP */

void function update() {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
