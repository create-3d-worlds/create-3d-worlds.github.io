import { camera, scene, renderer, clock, addUIControls } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import ChaseCamera from '/utils/classes/ChaseCamera.js'
import { terrainFromHeightmap } from '/utils/terrain/heightmap.js'
import { createTerrain } from '/utils/ground.js'
import Zeppelin from '/utils/classes/aircrafts/Zeppelin.js'
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js'

const stats = new Stats()
document.body.appendChild(stats.dom)

scene.add(await createSkySphere({ r: 5000 }))
const sun = createSun({ pos: [500, 2000, 100], far: 5000 })
scene.add(sun)

const terrain = createTerrain() // await terrainFromHeightmap({ file: 'yu.png', heightFactor: 3, snow: false })
// terrain.scale.set(100, 100, 100)
scene.add(terrain)

const mesh = await loadModel({ file: 'airship/dirigible/model.fbx', size: 10, shouldCenter: true, shouldAdjustHeight: true })
const zeppelin = new Zeppelin({ mesh })
mesh.position.y = 5
zeppelin.addSolids(terrain) // BUG!

scene.add(zeppelin.mesh)

const chaseCamera = new ChaseCamera({ camera, mesh, height: 8, speed: 2 })
chaseCamera.distance = 15
chaseCamera.alignCamera()

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  zeppelin.update(delta)
  chaseCamera.update(delta)
  stats.update()
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
