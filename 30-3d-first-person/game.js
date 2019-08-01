import {createTree} from '../utils/3d-helpers.js'
import {scene, renderer, camera} from '../utils/3d-scene.js'
import Avatar from '../classes/Avatar.js'

const avatar = new Avatar()
scene.add(avatar.mesh)

camera.position.z = 500
avatar.mesh.add(camera)

const coords = [[500, 0], [-500, 0], [300, -200], [-200, -800], [-750, -1000], [500, -1000]]
coords.map(coord => scene.add(createTree(...coord)))

void function animate() {
  requestAnimationFrame(animate)
  avatar.update()
  renderer.render(scene, camera)
}()
