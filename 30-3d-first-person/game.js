import {createTrees} from '../utils/3d-helpers.js'
import {scene, renderer, camera} from '../utils/3d-scene.js'
import Avatar from '../classes/Avatar.js'

const avatar = new Avatar()
scene.add(avatar.mesh)
scene.add(createTrees())

camera.position.z = 500
avatar.mesh.add(camera)

void function animate() {
  requestAnimationFrame(animate)
  avatar.update()
  renderer.render(scene, camera)
}()
