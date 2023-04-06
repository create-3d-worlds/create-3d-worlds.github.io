import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createRandomBoxes } from '/utils/geometry.js'
import { createGround } from '/utils/ground.js'
import Avatar from '/utils/actor/Avatar.js'
import { hemLight } from '/utils/light.js'

hemLight()

const floor = createGround({ file: 'terrain/ground.jpg' })
scene.add(floor)
const boxes = createRandomBoxes({ n: 400, mapSize: 200 })
scene.add(boxes)

const player = new Avatar({ camera, solids: [floor, boxes], jumpStyle: 'FLY_JUMP' })
player.cameraFollow.distance = 7
scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
