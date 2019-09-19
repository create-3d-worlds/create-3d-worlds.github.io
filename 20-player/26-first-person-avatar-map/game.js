import { createFloor } from '/utils/floor.js'
import { createMap } from '/utils/maps.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import {PlayerAvatar} from '/classes/Player.js'
import matrix from '/data/small-map.js'

const avatar = new PlayerAvatar(25, 0, 25, 10, 2)
scene.add(avatar.mesh)
const floor = createFloor()
scene.add(floor)
const walls = createMap(matrix, 20)
scene.add(walls)

camera.position.z = 20
camera.position.y = 15
avatar.mesh.add(camera)
avatar.addSolids(walls)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
