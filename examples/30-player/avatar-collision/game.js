import Avatar from '/utils/actor/Avatar.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createFirTrees } from '/utils/geometry/trees.js'

import { createGround } from '/utils/ground.js'
import { createSun } from '/utils/light.js'

scene.add(createGround())
const sun = createSun()
scene.add(sun)

const avatar = new Avatar()
avatar.add(camera)
scene.add(avatar.mesh)

const trees = createFirTrees()
scene.add(trees)
avatar.addSolids(trees)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
