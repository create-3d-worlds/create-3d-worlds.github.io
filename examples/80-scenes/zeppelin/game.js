import { camera, scene, renderer, clock, addUIControls } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry.js'
import { hemLight, ambLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createHillyTerrain, createWater } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'
import { getShuffledCoords, putOnSolids, addTexture } from '/utils/helpers.js'
import Dirigible from '/utils/aircrafts/child/Dirigible.js'
import { CloudAI } from '/utils/actor/child/Cloud.js'
import AerialScrew from '/utils/actor/child/AerialScrew.js'
import WizardIsle from '/utils/actor/child/WizardIsle.js'

const updatables = []

const mapSize = 800

scene.add(await createSkySphere({ r: 5000 }))
hemLight({ intensity: .5 })
ambLight({ intensity: .75 })

const terrain = await createHillyTerrain({ size: mapSize, factorY: 30 })
scene.add(terrain)

const water = createWater({ size: mapSize * 10 })
scene.add(water)

const treesCoords = getShuffledCoords({ mapSize: mapSize * .5, fieldSize: 4, emptyCenter: 50 })

const trees = createTreesOnTerrain({ terrain, n: 200, size: 4, coords: treesCoords })
scene.add(trees)

/* GAME OBJECTS */

const coords = getShuffledCoords({ mapSize: mapSize * .5, fieldSize: 40, emptyCenter: 50 })

const castle = await loadModel({ file: 'building/castle/magic-castle.fbx', size: 100 })
addTexture(castle, 'material/WhiteMarble.jpg', 4)
putOnSolids(castle, terrain)
scene.add(castle)

for (let i = 0; i < 10; i++) {
  const screw = new AerialScrew({ pos: coords.pop(), solids: terrain, altitude: 15 + 15 * Math.random() })
  updatables.push(screw)
}

for (let i = 0; i < 5; i++) {
  const scale = Math.random() + 1
  const isle = new WizardIsle({ pos: coords.pop(), solids: terrain, scale, altitude: scale * 10 })
  updatables.push(isle)
}

for (let i = 0; i < 5; i++) {
  const cloud = new CloudAI({ mapSize, pos: coords.pop() })
  updatables.push(cloud)
}

const zeppelin = new Dirigible({ camera, solids: terrain })
zeppelin.position.z = 200
updatables.push(zeppelin)

updatables.forEach(gameObj => scene.add(gameObj.mesh))

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()

  updatables.forEach(screw => screw.update(delta))

  renderer.render(scene, camera)
}()

/* UI */

const commands = {
  '←': 'levo',
  '→': 'desno',
  '↑': 'gore',
  '↓': 'dole',
  'PgUp': 'ubrzavanje',
  'PgDn': 'usporavanje',
}
addUIControls({ commands })
