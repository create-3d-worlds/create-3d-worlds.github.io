import Avatar from '../classes/Avatar.js'
import {scene, renderer, camera, clock} from '../utils/scene.js'
import {createFirTrees} from '../utils/trees.js'
import {createFloor} from '../utils/floor.js'

const avatar = new Avatar()
scene.add(avatar.mesh)

camera.position.z = 100
camera.position.y = 50
avatar.add(camera)

const trees = createFirTrees(10, 500, 50)
scene.add(trees)
avatar.addSurrounding(trees)
scene.add(createFloor())

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()