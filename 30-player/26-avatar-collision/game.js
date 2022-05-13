import { PlayerAvatar } from '/classes/Player.js'
import { createWorldScene, renderer, camera, clock } from '/utils/scene.js'
import { createFirTrees } from '/utils/trees.js'

const scene = createWorldScene()
const avatar = new PlayerAvatar()
scene.add(avatar.mesh)

camera.position.z = 100
camera.position.y = 50
avatar.add(camera)

const trees = createFirTrees({ n: 10, mapSize: 500, size: 50 })
scene.add(trees)
avatar.addSolids(trees)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
