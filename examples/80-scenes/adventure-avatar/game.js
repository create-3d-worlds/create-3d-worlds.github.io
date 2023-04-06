import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry.js'
import { createStairway, createBabelTower, createBaradDur, createRingTower } from '/utils/geometry/towers.js'
import { createTerrain, createLava } from '/utils/ground.js'
import { hemLight, dirLight } from '/utils/light.js'
import { getShuffledCoords } from '/utils/helpers.js'
import Avatar from '/utils/actor/Avatar.js'

const mapSize = 1000

scene.add(createSkySphere())
hemLight({ intensity: 1 }) // createSun pravi bug prilikom letenja
dirLight({ intensity: .25 })

const terrain = createTerrain({ size: mapSize, factor: 10 })
scene.add(terrain)

/* BUILDING */

const coords = getShuffledCoords({ mapSize: mapSize / 2, fieldSize: 50, emptyCenter: 100 })

const stairsLeft = createStairway({ floors: 5 })
stairsLeft.position.copy(coords.pop())
stairsLeft.rotateY(Math.PI / 2)
scene.add(stairsLeft)

const stairsRight = createStairway({ floors: 5 })
stairsRight.position.copy(coords.pop())
stairsRight.rotateY(-Math.PI / 4)
scene.add(stairsRight)

const babelTower = createBabelTower({ floors: 6 })
const lava = createLava({ size: 50 })
lava.translateY(1.5)

const baradDur = createBaradDur()
baradDur.position.copy(coords.pop())

const spaceTower = createRingTower()
spaceTower.position.copy(coords.pop())

scene.add(terrain, lava, babelTower, baradDur, spaceTower)

/* PLAYER */

const solids = [terrain, stairsRight, stairsLeft, babelTower, baradDur, spaceTower]

const player = new Avatar({ camera, solids, pos: [60, 0, 0], skin: 'DISCO' })
scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player.update(delta)

  renderer.render(scene, camera)
}()
