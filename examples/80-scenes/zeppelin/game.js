import * as THREE from 'three'
import { camera, scene, renderer, clock, addUIControls } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry.js'
import { createSun, hemLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createHillyTerrain, createWater } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'
import { getShuffledCoords, putOnSolids } from '/utils/helpers.js'
import Dirigible from '/utils/classes/aircrafts/child/Dirigible.js'
import { CloudAI } from '/utils/actor/child/Cloud.js'

export const domainColors = [0x5C4033, 0x228b22, 0xf0e68c]

const mapSize = 800
const coords = getShuffledCoords({ mapSize: mapSize * .5, fieldSize: 40 })

scene.add(await createSkySphere({ r: 5000 }))
scene.fog = new THREE.Fog(0xE5C5AB, 1, 5000)

const sun = createSun({ pos: [250, 1000, 100], far: 5000 })
scene.add(sun)
hemLight({ intensity: .5 })

const terrain = await createHillyTerrain({ factorY: 30, size: mapSize, domainColors })
scene.add(terrain)
scene.add(createWater({ size: mapSize * 10 }))

const trees = createTreesOnTerrain({ mapSize: mapSize * .5, terrain, n: 200, size: 4 })
scene.add(trees)

const screw = await loadModel({ file: 'airship/aerial-screw/model.fbx', size: 10, shouldCenter: true, fixColors: true })

const screws = []
for (let i = 0; i < 10; i++) {
  const mesh = screw.clone()
  mesh.position.copy(coords.pop())
  putOnSolids(mesh, terrain, 25)
  scene.add(mesh)
  screws.push(mesh)
}

const house = await loadModel({ file: 'building/wizard-isle/model.fbx', size: 20 })
for (let i = 0; i < 5; i++) {
  const mesh = house.clone()
  const scale = Math.random() + 1
  mesh.scale.set(scale, scale, scale)
  mesh.position.copy(coords.pop())
  putOnSolids(mesh, terrain, scale * 10)
  scene.add(mesh)
}

const castle = await loadModel({ file: 'building/castle/magic-castle.fbx', size: 100 })
castle.position.copy(coords.pop())
putOnSolids(castle, terrain)
scene.add(castle)

const zeppelin = new Dirigible({ camera, solids: [terrain, castle] })
scene.add(zeppelin.mesh)

const clouds = []
for (let i = 0; i < 5; i++) {
  const cloud = new CloudAI({ mapSize, pos: coords.pop() })
  clouds.push(cloud)
  scene.add(cloud.mesh)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  zeppelin.update(delta)
  screws.forEach(screw => screw.rotateY(delta * screw.position.y * .02))
  clouds.forEach(cloud => cloud.update(delta))
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
