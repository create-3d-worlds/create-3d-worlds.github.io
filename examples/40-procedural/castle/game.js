import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { buildCastle } from '/core/geometry/towers.js'
import { hemLight } from '/core/light.js'
import { createGround } from '/core/ground.js'

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
