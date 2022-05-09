import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { PlayerModel, Robotko } from '/classes/index.js'
import { dirLight, hemLight } from '/utils/light.js'

hemLight()
dirLight()

camera.position.set(50, 10, 0)
createOrbitControls()

const player = new PlayerModel(0, 0, 0, 20, mesh => {
  scene.add(mesh)
}, Robotko)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
