import { scene, camera, renderer, clock } from '/utils/scene.js'
import { handleInput } from '/utils/player.js'
import { createFloor } from '/utils/ground.js'
import { createCrate } from '/utils/boxes.js'
import { initLights } from '/utils/light.js'

initLights()
camera.position.set(0, 15, 40)

const floor = createFloor({ size: 100 })
scene.add(floor)

const player = createCrate({ size: 5 })
scene.add(player)

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  handleInput(player, delta)
  renderer.render(scene, camera)
}()