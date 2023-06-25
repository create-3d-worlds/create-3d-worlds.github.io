import { camera, scene, renderer, clock, addUIControls } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry/index.js'
import { hemLight, ambLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createHillyTerrain, createWater } from '/utils/ground.js'
import { getEmptyCoords, putOnSolids } from '/utils/helpers.js'

const updatables = []

const mapSize = 800

hemLight({ intensity: .75 })
ambLight({ intensity: .5 })

camera.position.set(0, 40, 200)
scene.add(await createSkySphere({ r: 5000 }))

const terrain = await createHillyTerrain({ size: mapSize, factorY: 30 })
scene.add(terrain)

const water = createWater({ size: mapSize * 10 })
scene.add(water)

/* UTILS */

const addEntity = entity => {
  scene.add(entity.mesh)
  updatables.push(entity)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()

  updatables.forEach(screw => screw.update(delta))
  renderer.render(scene, camera)
}()

/* LAZY LOAD */

const dirigibleFile = await import('/utils/aircraft/derived/Dirigible.js')
const zeppelin = new dirigibleFile.default({ camera, solids: terrain })
zeppelin.position.z = 200
addEntity(zeppelin)

const { createTreesOnTerrain } = await import('/utils/geometry/trees.js')
const treesCoords = getEmptyCoords({ mapSize: mapSize * .5, fieldSize: 4, emptyCenter: 50 })
const trees = createTreesOnTerrain({ terrain, n: 200, size: 4, coords: treesCoords })
scene.add(trees)

const coords = getEmptyCoords({ mapSize: mapSize * .75, fieldSize: 40, emptyCenter: 50 })

const castle = await loadModel({ file: 'building/castle/magic-castle.fbx', size: 100 })
putOnSolids(castle, terrain)
scene.add(castle)

const cloudFile = await import('/utils/objects/Cloud.js')
for (let i = 0; i < 10; i++) {
  const cloud = new cloudFile.default({ mapSize: mapSize * 2, pos: coords.pop() })
  addEntity(cloud)
}

const aerialFile = await import('/utils/objects/AerialScrew.js')
for (let i = 0; i < 10; i++) {
  const screw = new aerialFile.default({ pos: coords.pop(), solids: terrain, altitude: 15 + 15 * Math.random() })
  addEntity(screw)
}

const isleFile = await import('/utils/objects/WizardIsle.js')
for (let i = 0; i < 4; i++) {
  const scale = Math.random() + 1
  const isle = new isleFile.default({ pos: coords.pop(), solids: terrain, scale, altitude: scale * 10 })
  addEntity(isle)
}

updatables.forEach(gameObj => scene.add(gameObj.mesh))

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
