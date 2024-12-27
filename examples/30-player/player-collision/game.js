import Avatar from '/core/actor/Avatar.js'
import { scene, renderer, camera, clock } from '/core/scene.js'
import { createFirTrees } from '/core/geometry/trees.js'

import { createGround } from '/core/ground.js'
import { createSun } from '/core/light.js'

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
