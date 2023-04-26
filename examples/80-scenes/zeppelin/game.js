import { camera, scene, renderer, clock, addUIControls } from '/utils/scene.js'
import { createSkySphere } from '/utils/geometry.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import ChaseCamera from '/utils/classes/ChaseCamera.js'
import { createHillyTerrain } from '/utils/ground.js'
import Zeppelin from '/utils/classes/aircrafts/Zeppelin.js'

scene.add(await createSkySphere({ r: 5000 }))
const sun = createSun({ pos: [250, 1000, 100], far: 5000 })
scene.add(sun)

const terrain = await createHillyTerrain({ factorY: 30 })
terrain.scale.set(20, 20, 20)
scene.add(terrain)

const mesh = await loadModel({ file: 'airship/dirigible/model.fbx', size: 4, shouldCenter: true, shouldAdjustHeight: true })
const zeppelin = new Zeppelin({ mesh, speed: 4 })
mesh.position.y = 400
zeppelin.addSolids(terrain)
scene.add(zeppelin.mesh)

const chaseCamera = new ChaseCamera({ camera, mesh, height: 2, speed: zeppelin.speed * .75 })
chaseCamera.distance = 6
chaseCamera.alignCamera()

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  zeppelin.update(delta)
  chaseCamera.update(delta)
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
