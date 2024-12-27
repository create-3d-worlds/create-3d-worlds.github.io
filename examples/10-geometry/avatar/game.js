import { scene, camera, renderer } from '/core/scene.js'
import { createAvatar } from '/core/actor/Avatar.js'
import { hemLight } from '/core/light.js'

hemLight()

const avatar = createAvatar()
scene.add(avatar)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
