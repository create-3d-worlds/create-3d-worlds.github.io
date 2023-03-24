import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { buildCastle } from '/utils/geometry/towers.js'
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
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
