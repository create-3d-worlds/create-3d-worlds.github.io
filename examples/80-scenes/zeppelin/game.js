import * as THREE from 'three'
import { camera, scene, renderer, clock, addUIControls } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry.js'
import { createSun, hemLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import ChaseCamera from '/utils/classes/ChaseCamera.js'
import { createHillyTerrain } from '/utils/ground.js'
import Zeppelin from '/utils/classes/aircrafts/Zeppelin.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'

const mapSize = 800

scene.add(await createSkySphere({ r: 5000 }))
const sun = createSun({ pos: [250, 1000, 100], far: 5000 })
scene.add(sun)

hemLight()
scene.fog = new THREE.Fog(0xE5C5AB, 1, 5000)

const terrain = await createHillyTerrain({ factorY: 30, size: mapSize })
scene.add(terrain)

const trees = createTreesOnTerrain({ mapSize, terrain, size: 3.5 })
scene.add(trees)

// const screw = await loadModel({ file: 'airship/aerial-screw/model.fbx', size: 10, shouldCenter: true, shouldAdjustHeight: true })
// screw.position.y = 30
// scene.add(screw)

const mesh = await loadModel({ file: 'airship/dirigible/model.fbx', size: 4, shouldCenter: true, shouldAdjustHeight: true })
const zeppelin = new Zeppelin({ mesh, camera, solids: terrain })
scene.add(zeppelin.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  zeppelin.update(delta)
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
