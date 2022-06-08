import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createRandomBoxes } from '/utils/geometry.js'
import { createGround } from '/utils/ground.js'
import Avatar from '/classes/Avatar.js'
import { hemLight } from '/utils/light.js'

hemLight()

const floor = createGround({ file: 'ground.jpg' })
scene.add(floor)
const boxes = createRandomBoxes()
scene.add(boxes)

const player = new Avatar({ size: 2 })
player.mesh.rotateY(Math.PI)
scene.add(player.mesh)

player.addSolids(floor, boxes)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
