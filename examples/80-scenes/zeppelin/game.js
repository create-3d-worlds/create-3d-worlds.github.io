import * as THREE from 'three'
import { camera, scene, renderer, clock, addUIControls } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry.js'
import { createSun, hemLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createHillyTerrain } from '/utils/ground.js'
import Dirigible from '/utils/classes/aircrafts/child/Dirigible.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'
import { getShuffledCoords, putOnSolids } from '/utils/helpers.js'

const mapSize = 800
const coords = getShuffledCoords({ mapSize: 200 })

scene.add(await createSkySphere({ r: 5000 }))
const sun = createSun({ pos: [250, 1000, 100], far: 5000 })
scene.add(sun)

hemLight()
scene.fog = new THREE.Fog(0xE5C5AB, 1, 5000)

const terrain = await createHillyTerrain({ factorY: 30, size: mapSize })
scene.add(terrain)

const trees = createTreesOnTerrain({ mapSize, terrain, size: 3.5 })
scene.add(trees)

const screwMesh = await loadModel({ file: 'airship/aerial-screw/model.fbx', size: 10, shouldCenter: true, fixColors: true })

const screws = []
for (let i = 0; i < 10; i++) {
  const screw = screwMesh.clone()
  screw.position.copy(coords.pop())
  putOnSolids(screw, terrain, 15)
  scene.add(screw)
  screws.push(screw)
}

const zeppelin = new Dirigible({ camera, solids: terrain })
scene.add(zeppelin.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  zeppelin.update(delta)
  screws.forEach(screw => screw.rotateY(delta * screw.position.y * .02))
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
