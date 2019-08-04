import { scene, camera, renderer, clock } from '../utils/3d-scene.js'
import { createFloor } from '../utils/3d-helpers.js'
import Avatar from '../classes/Avatar.js'

const player = new Avatar()
scene.add(createFloor(1000, 1000))
scene.add(player.mesh)

function cameraFollow(obj) {
  const cameraDistance = [0, 50, 200]
  const {x, y, z} = new THREE.Vector3(...cameraDistance).applyMatrix4(obj.matrixWorld)
  camera.position.set(x, y, z)
  camera.lookAt(obj.position)
}

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  cameraFollow(player.mesh)
  player.update(delta)
  renderer.render(scene, camera)
}()
