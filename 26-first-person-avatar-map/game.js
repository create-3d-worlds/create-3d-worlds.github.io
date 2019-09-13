import { createFloor } from '/utils/floor.js'
import { createMap } from '/utils/boxes.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import Player from '/classes/Player.js'
import matrix from '/data/small-map.js'

const avatar = new Player(25, 0, 25, 10)
scene.add(avatar.mesh)
scene.add(createFloor())
const walls = createMap(matrix, 20)
scene.add(walls)

camera.position.z = 20
camera.position.y = 15
avatar.mesh.add(camera)
avatar.addSurrounding(walls)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
