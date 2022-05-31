import { camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createScene, createBox, createGround } from '/utils/physics.js'
import { dirLight } from '/utils/light.js'

createOrbitControls()

const scene = createScene()

scene.add(createGround())

dirLight({ scene })

/* LOOP */

let timeStep = 0

void function update() {
  window.requestAnimationFrame(update)
  scene.simulate()
  if (++timeStep % 100 == 0) {
    const box = createBox()
    box.position.y = 5
    scene.add(box)
  }
  renderer.render(scene, camera)
}()
