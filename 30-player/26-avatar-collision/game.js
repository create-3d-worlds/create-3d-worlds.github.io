import { PlayerAvatar } from '/classes/Player.js'
import { createFullScene, renderer, camera, clock, hemLight } from '/utils/scene.js'
import { createFirTrees } from '/utils/trees.js'

const scene = createFullScene()
hemLight()
const avatar = new PlayerAvatar()
scene.add(avatar.mesh)

camera.position.z = 100
camera.position.y = 50
avatar.add(camera)

const trees = createFirTrees(10, 500, 50)
scene.add(trees)
avatar.addSolids(trees)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
