import { camera, scene, renderer, clock, addUIControls } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry.js'
import { createSun, hemLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createHillyTerrain, createWater } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'
import { getShuffledCoords, putOnSolids } from '/utils/helpers.js'
import Dirigible from '/utils/classes/aircrafts/child/Dirigible.js'
import { CloudAI } from '/utils/actor/child/Cloud.js'
import AerialScrew from '/utils/actor/child/AerialScrew.js'

const updatables = []

const mapSize = 800
const coords = getShuffledCoords({ mapSize: mapSize * .5, fieldSize: 40 })

scene.add(await createSkySphere({ r: 5000 }))
scene.add(createSun({ pos: [250, 1000, 100], r: 10 }))
hemLight({ intensity: .5 })

const terrain = await createHillyTerrain({ size: mapSize, factorY: 30, terrainColors: [0x5C4033, 0x228b22, 0xf0e68c] })
scene.add(terrain)

scene.add(createWater({ size: mapSize * 10 }))

const trees = createTreesOnTerrain({ mapSize: mapSize * .5, terrain, n: 200, size: 4 })
scene.add(trees)

/* screws */

for (let i = 0; i < 10; i++) {
  const screw = new AerialScrew({ pos: coords.pop(), solids: terrain, altitude: 15 + 15 * Math.random() })
  updatables.push(screw)
  scene.add(screw.mesh)
}

/* wizard-isle */

const house = await loadModel({ file: 'building/wizard-isle/model.fbx', size: 20 })
for (let i = 0; i < 5; i++) {
  const mesh = house.clone()
  const scale = Math.random() + 1
  mesh.scale.set(scale, scale, scale)
  mesh.position.copy(coords.pop())
  putOnSolids(mesh, terrain, scale * 10)
  scene.add(mesh)
}

/* magic-castle */

const castle = await loadModel({ file: 'building/castle/magic-castle.fbx', size: 100 })
castle.position.copy(coords.pop())
putOnSolids(castle, terrain)
scene.add(castle)

/* clouds */

for (let i = 0; i < 5; i++) {
  const cloud = new CloudAI({ mapSize, pos: coords.pop() })
  updatables.push(cloud)
  scene.add(cloud.mesh)
}

const zeppelin = new Dirigible({ camera, solids: [terrain, castle] })
scene.add(zeppelin.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  zeppelin.update(delta)
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
