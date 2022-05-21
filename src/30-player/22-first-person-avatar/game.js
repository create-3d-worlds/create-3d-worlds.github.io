import { createTrees } from '/utils/trees.js'
import { renderer, camera, clock, createWorldScene } from '/utils/scene.js'
import Avatar from '/classes/Avatar.js'

const scene = createWorldScene({ file: 'ground.jpg' })
const avatar = new Avatar()

scene.add(avatar.mesh, createTrees())

avatar.mesh.add(camera)
camera.position.y = 4
camera.position.z = 8

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
