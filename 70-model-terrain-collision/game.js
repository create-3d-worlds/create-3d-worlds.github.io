import {scene, camera, renderer, clock} from '../utils/scene.js'
import {createSpiralStairs} from '../utils/boxes.js'
import {createFloor} from '../utils/floor.js'
import Player from '../classes/Player.js'

camera.position.z = 40
camera.position.y = 20

const floor = createFloor()
scene.add(floor)
const stairs = createSpiralStairs(5, 40, 40)
scene.add(stairs)

const avatar = new Player(100, 50, -50, 10, mesh => {
  mesh.rotateY(Math.PI)
  mesh.add(camera)
  scene.add(mesh)
})
avatar.addGround(floor, stairs)
avatar.addSurrounding(stairs)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
