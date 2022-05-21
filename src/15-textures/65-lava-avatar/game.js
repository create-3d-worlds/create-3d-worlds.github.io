import { camera, scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createAvatar, uniforms, skins } from '/utils/createAvatar.js'

createOrbitControls()

camera.position.z = 5
camera.position.y = 2

const avatar = createAvatar({ skin: skins.LAVA })
scene.add(avatar)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  uniforms.time.value += 0.8 * clock.getDelta()
  renderer.render(scene, camera)
}()
