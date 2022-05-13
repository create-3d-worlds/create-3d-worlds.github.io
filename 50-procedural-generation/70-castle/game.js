import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { buildCastle } from '/utils/towers.js'
import Avatar from '/classes/Avatar.js'
import { hemLight } from '/utils/light.js'

hemLight()

camera.position.y = 30
camera.position.z = 150
createOrbitControls()

const castle = buildCastle()
// castle.position.z = -400
scene.add(castle)

const avatar = new Avatar({ size: 20 })
scene.add(avatar.mesh)

/* LOOP **/

void function update() {
  window.requestAnimationFrame(update)
  avatar.update()
  renderer.render(scene, camera)
}()
