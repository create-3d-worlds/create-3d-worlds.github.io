import { createTrees } from '/utils/geometry/trees.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import Avatar from '/utils/actor/Avatar.js'

import { createGround } from '/utils/ground.js'
import { createSun } from '/utils/light.js'

scene.add(createGround({ file: 'terrain/ground.jpg' }))
const sun = createSun()
scene.add(sun)

const player = new Avatar()

scene.add(player.mesh, createTrees())
player.add(camera)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
