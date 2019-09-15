import {scene, camera, renderer, clock} from '/utils/scene.js'
import {createSpiralStairs} from '/utils/boxes.js'
import {createTerrain} from '/utils/floor.js'
import {PlayerAvatar} from '/classes/Player.js'

camera.position.z = 40
camera.position.y = 20

const terrain = createTerrain()
scene.add(terrain)
const stairs = createSpiralStairs(5)
// const stairs = createSpiralStairs(5, 40, 40)
scene.add(stairs)

const avatar = new PlayerAvatar(100, 50, -50, 10, 0)
avatar.addSolids(terrain, stairs)
avatar.mesh.rotateY(Math.PI)
avatar.add(camera)
scene.add(avatar.mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
