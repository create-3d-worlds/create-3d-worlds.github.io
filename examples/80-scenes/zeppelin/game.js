import { camera, scene, createToonRenderer, clock } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { loadModel } from '/core/loaders.js'
import { createHillyTerrain, createWater } from '/core/ground.js'
import { getEmptyCoords, putOnSolids } from '/core/helpers.js'
import GUI from '/core/io/GUI.js'

const renderer = await createToonRenderer(0.0015)

const updatables = []
const mapSize = 800

scene.add(createSun({ intensity: Math.PI * 2, pos: [75, 140, -75], r: 5 }))
camera.position.set(0, 40, 200)

const terrain = await createHillyTerrain({ size: mapSize, factorY: 30 })
scene.add(terrain)

const water = createWater({ size: mapSize * 10 })
scene.add(water)

const controls = {
  '← or A': 'left',
  '→ or D': 'right',
  '↑ or W': 'up',
  '↓ or S': 'down',
  'PgUp': 'speed up',
  'PgDn': 'slow down',
}
new GUI({ controls, controlsClass: 'rpgui-button', scoreTitle: '' })

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

const coords = getEmptyCoords({ mapSize: mapSize * .75, fieldSize: 40, emptyCenter: 50 })

const castle = await loadModel({ file: 'building/castle/magic-castle.fbx', size: 100 })
putOnSolids(castle, terrain)
scene.add(castle)

const dirigibleFile = await import('/core/aircraft/derived/Dirigible.js')
const player = new dirigibleFile.default({ camera, solids: terrain, cameraClass: 'rpgui-button' })
player.position.z = 200
player.solids.push(castle)
addEntity(player)

const { createTreesOnTerrain } = await import('/core/geometry/trees.js')
const treesCoords = getEmptyCoords({ mapSize: mapSize * .5, fieldSize: 4, emptyCenter: 50 })
const trees = createTreesOnTerrain({ terrain, n: 100, size: 6, coords: treesCoords })
scene.add(trees)

const cloudFile = await import('/core/objects/Cloud.js')
for (let i = 0; i < 10; i++) {
  const cloud = new cloudFile.default({ mapSize: mapSize * 2, pos: coords.pop() })
  addEntity(cloud)
}

const aerialFile = await import('/core/objects/AerialScrew.js')
for (let i = 0; i < 8; i++) {
  const screw = new aerialFile.default({ pos: coords.pop(), solids: terrain, altitude: 20 + 20 * Math.random() })
  addEntity(screw)
}

const isleFile = await import('/core/objects/WizardIsle.js')
const isle = new isleFile.default({ pos: coords.pop(), solids: terrain, altitude: 40 })
addEntity(isle)

updatables.forEach(gameObj => scene.add(gameObj.mesh))
