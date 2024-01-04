import { scene, camera, renderer } from '/utils/scene.js'
import { createAvatar } from '/utils/actor/Avatar.js'
import { hemLight } from '/utils/light.js'

hemLight()

const avatar = createAvatar()
scene.add(avatar)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
