import * as THREE from 'three'
import { camera, scene, renderer, clock, addUIControls } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry.js'
import { createSun, hemLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createHillyTerrain } from '/utils/ground.js'
import Dirigible from '/utils/classes/aircrafts/child/Dirigible.js'
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

// airship/aerial-screw/model.fbx
const screw = await loadModel({ file: 'airship/air_screw/scene.gltf', size: 10 })
screw.position.y = 20
scene.add(screw)

const zeppelin = new Dirigible({ camera, solids: terrain })
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
