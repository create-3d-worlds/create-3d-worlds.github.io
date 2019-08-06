import Avatar from '../classes/Avatar.js'
import {scene, renderer, camera, clock, createOrbitControls} from '../utils/3d-scene.js'
import {createTrees} from '../utils/3d-helpers.js'

const avatar = new Avatar(0, 0, 1)
scene.add(avatar.mesh)

camera.position.z = 500
avatar.add(camera)
// createOrbitControls()

scene.add(createTrees(10, -1000, 1000, 200))

const solids = []
scene.traverse(child => {
  if (child.name == 'solid') solids.push(child)
})

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta, solids)
  renderer.render(scene, camera)
}()
