import { createWorldScene, camera, renderer, clock } from '/utils/scene.js'
import { createSpiralStairs } from '/utils/towers.js'
import { createTerrain } from '/utils/ground.js'
import Avatar from '/classes/Avatar.js'

const scene = createWorldScene()
camera.position.z = 6
camera.position.y = 3

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

const avatar = new Avatar(100, 50, -50, 10, 0)
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
