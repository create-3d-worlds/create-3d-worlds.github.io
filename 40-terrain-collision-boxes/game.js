import {scene, camera, renderer, clock} from '../utils/scene.js'
import {createSpiralStairs} from '../utils/boxes.js'
import {createTerrain} from '../utils/floor.js'
import Avatar from '../classes/Avatar.js'

camera.position.z = 30
camera.position.y = 20

const terrain = createTerrain()
scene.add(terrain)
const stairs = createSpiralStairs(5)
scene.add(stairs)

const avatar = new Avatar(100, 50, -50, 10, false)
avatar.mesh.rotateY(Math.PI)
avatar.add(camera)
avatar.addGround(terrain, stairs)
avatar.addSurrounding(stairs)
scene.add(avatar.mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
