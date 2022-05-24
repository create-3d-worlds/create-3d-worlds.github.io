import { createWorldScene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createSpiralStairs } from '/utils/towers.js'
import { createTerrain } from '/utils/ground.js'
import Avatar from '/classes/Avatar.js'

// createOrbitControls()
const scene = createWorldScene() // ne radi kolizija za pod
camera.position.z = 7
camera.position.y = 5

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
avatar.add(camera)
scene.add(avatar.mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
