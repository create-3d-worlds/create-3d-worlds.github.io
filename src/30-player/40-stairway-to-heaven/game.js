import { createWorldScene, camera, renderer, clock } from '/utils/scene.js'
import { createSpiralStairs } from '/utils/towers.js'
import { createTerrain } from '/utils/ground.js'
import Avatar from '/classes/Avatar.js'

const scene = createWorldScene()

const terrain = createTerrain()
scene.add(terrain)

const stairsLeft = createSpiralStairs({ floors: 5 })
const stairsRight = createSpiralStairs({ floors: 5 })
scene.add(stairsRight)
scene.add(stairsLeft)

stairsLeft.position.x = 50
stairsLeft.rotateY(Math.PI / 2)
stairsRight.position.x = -50
stairsRight.rotateY(-Math.PI / 4)

const avatar = new Avatar()
avatar.addSolids(terrain, stairsRight, stairsLeft)
avatar.mesh.rotateY(Math.PI)
scene.add(avatar.mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)

  renderer.render(scene, camera)
}()
