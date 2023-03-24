import Avatar from '/utils/player/Avatar.js'
import { createWorldScene, renderer, camera, clock } from '/utils/scene.js'
import { createFirTrees } from '/utils/geometry/trees.js'

const scene = createWorldScene()
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
