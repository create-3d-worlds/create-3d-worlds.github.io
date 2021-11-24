import {createFullScene, camera, renderer, clock} from '/utils/scene.js'
import {createSpiralStairs} from '/utils/boxes.js'
import {createTerrain} from '/utils/floor.js'
import {PlayerAvatar} from '/classes/Player.js'

const scene = createFullScene()
camera.position.z = 40
camera.position.y = 20

const terrain = createTerrain()
scene.add(terrain)

const stairsLeft = createSpiralStairs(5, 40, 40)
const stairsRight = createSpiralStairs(5)
scene.add(stairsRight)
scene.add(stairsLeft)

stairsLeft.position.x = 200
stairsLeft.rotateY(Math.PI / 2)
stairsRight.position.x = -200
stairsRight.rotateY(-Math.PI / 4)

const avatar = new PlayerAvatar(100, 50, -50, 10, 0)
avatar.addSolids(terrain, stairsRight, stairsLeft)
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
