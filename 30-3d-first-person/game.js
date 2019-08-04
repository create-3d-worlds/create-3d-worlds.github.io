import {createTrees} from '../utils/3d-helpers.js'
import {scene, renderer, camera, clock} from '../utils/3d-scene.js'
import Avatar from '../classes/Avatar.js'

const avatar = new Avatar()
scene.add(avatar.mesh)
scene.add(createTrees())

camera.position.z = 200
avatar.mesh.add(camera) // camera is added to player

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
