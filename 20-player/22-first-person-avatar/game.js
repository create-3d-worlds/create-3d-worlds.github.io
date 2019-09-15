import {createFloor} from '/utils/floor.js'
import {createTrees} from '/utils/trees.js'
import {scene, renderer, camera, clock} from '/utils/scene.js'
import {PlayerAvatar} from '/classes/Player.js'

const avatar = new PlayerAvatar()

scene.add(avatar.mesh, createTrees(), createFloor())

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
