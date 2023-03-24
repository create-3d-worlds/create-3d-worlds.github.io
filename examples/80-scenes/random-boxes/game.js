import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createRandomBoxes } from '/utils/geometry.js'
import { createGround } from '/utils/ground.js'
import Avatar from '/utils/player/Avatar.js'
import { hemLight } from '/utils/light.js'

hemLight()

const floor = createGround({ file: 'terrain/ground.jpg' })
scene.add(floor)
const boxes = createRandomBoxes()
scene.add(boxes)

camera.position.z = 9

const player = new Avatar({ size: 1 })
player.mesh.rotateY(Math.PI)
player.add(camera)
scene.add(player.mesh)

player.addSolids(floor, boxes)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
