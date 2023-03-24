import { scene, camera, renderer } from '/utils/scene.js'
import { createAvatar } from '/utils/geometry/avatar.js'
import { hemLight } from '/utils/light.js'

hemLight()
camera.position.z = 5
camera.position.y = 2

const avatar = createAvatar()
scene.add(avatar)

/* LOOP */

void function animiraj() {
  requestAnimationFrame(animiraj)
  renderer.render(scene, camera)
}()
