import Avatar from '/utils/actor/Avatar.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createFirTrees } from '/utils/geometry/trees.js'

import { createGround } from '/utils/ground.js'
import { createSun } from '/utils/light.js'

scene.add(createGround())
const sun = createSun()
scene.add(sun)

const player = new Avatar()
player.add(camera)
scene.add(player.mesh)

const trees = createFirTrees()
scene.add(trees)
player.addSolids(trees)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
