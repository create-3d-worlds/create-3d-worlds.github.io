import Avatar from '../classes/Avatar.js'
import {scene, renderer, camera, clock, createOrbitControls} from '../utils/three-scene.js'
import {createFirTrees} from '../utils/trees.js'

const avatar = new Avatar(0, 0)
scene.add(avatar.mesh)

camera.position.z = 500
avatar.add(camera)
// createOrbitControls()
const trees = createFirTrees(10, 500, 50)

scene.add(trees)

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta, trees.children, scene)
  renderer.render(scene, camera)
}()
