import { scene, camera, renderer, clock } from '/utils/scene.js'
import { handleInput } from '/utils/player.js'
import { createFloor } from '/utils/ground.js'
import { createCrate } from '/utils/geometry.js'
import { initLights } from '/utils/light.js'

initLights()

const floor = createFloor({ size: 25 })
scene.add(floor)

const player = createCrate({ size: 1 })
scene.add(player)

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  handleInput(player, delta)
  renderer.render(scene, camera)
}()