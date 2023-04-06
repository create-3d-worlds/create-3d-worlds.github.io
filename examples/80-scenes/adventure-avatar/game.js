import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry.js'
import { createStairway, createBabelTower, createBaradDur, createRingTower } from '/utils/geometry/towers.js'
import { createTerrain, createLava, createGround } from '/utils/ground.js'
import { hemLight, dirLight } from '/utils/light.js'
import { getShuffledCoords } from '/utils/helpers.js'
import Avatar from '/utils/actor/Avatar.js'

const mapSize = 1000

scene.add(createSkySphere())
hemLight({ intensity: 1 }) // createSun pravi bug prilikom letenja
dirLight({ intensity: .25 })

const terrain = createTerrain({ size: mapSize })
scene.add(terrain)

/* BUILDING */

const coords = getShuffledCoords({ mapSize: mapSize / 2, fieldSize: 50, emptyCenter: 100 })

const stairsLeft = createStairway({ floors: 5 })
stairsLeft.position.copy(coords.pop())
stairsLeft.rotateY(Math.PI / 2)

const stairsRight = createStairway({ floors: 5 })
stairsRight.position.copy(coords.pop())
stairsRight.rotateY(-Math.PI / 4)

const babelTower = createBabelTower({ floors: 6 })
const lava = createLava({ size: 50 })
lava.translateY(4)

const lavaBottom = createGround({ size: 50 })
lavaBottom.translateY(3.5)
scene.add(lavaBottom)

const baradDur = createBaradDur()
baradDur.position.copy(coords.pop())

const spaceTower = createRingTower()
spaceTower.position.copy(coords.pop())

const solids = [terrain, stairsRight, stairsLeft, babelTower, baradDur, spaceTower, lavaBottom]
scene.add(...solids, lava)

/* PLAYER */

const player = new Avatar({ camera, solids, skin: 'DISCO' })
scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player.update(delta)

  renderer.render(scene, camera)
}()
