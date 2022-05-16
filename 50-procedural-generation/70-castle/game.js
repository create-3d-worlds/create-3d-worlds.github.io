import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { buildCastle } from '/utils/towers.js'
import { hemLight } from '/utils/light.js'
import { createGround } from '/utils/ground.js'

hemLight()

camera.position.y = 150
camera.position.z = 450
createOrbitControls()

const castle = buildCastle()
scene.add(castle, createGround())

/* LOOP **/

void function update() {
  window.requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
