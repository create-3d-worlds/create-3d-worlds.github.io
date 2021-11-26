import { createTrees } from '/utils/trees.js'
import { renderer, camera, clock, createFullScene } from '/utils/scene.js'
import { PlayerAvatar } from '/classes/Player.js'

const scene = createFullScene({ file: 'ground.jpg' })
const avatar = new PlayerAvatar()

scene.add(avatar.mesh, createTrees())

avatar.mesh.add(camera)
camera.position.y = 50
camera.position.z = 100

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
