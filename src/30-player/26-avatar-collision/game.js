import Avatar from '/classes/Avatar.js'
import { createWorldScene, renderer, camera, clock } from '/utils/scene.js'
import { createFirTrees } from '/utils/trees.js'

const scene = createWorldScene()
const avatar = new Avatar()
scene.add(avatar.mesh)

const trees = createFirTrees()
scene.add(trees)
avatar.addSolids(trees)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
