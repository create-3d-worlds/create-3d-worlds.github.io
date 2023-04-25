import { camera, scene, renderer, clock, addUIControls } from '/utils/scene.js'
import { createHillyTerrain } from '/utils/ground.js'
import { createSkySphere } from '/utils/geometry.js'
import { createSun } from '/utils/light.js'
import Zeppelin from '/utils/classes/aircrafts/Zeppelin.js'
import { loadModel } from '/utils/loaders.js'
import ChaseCamera from '/utils/classes/ChaseCamera.js'

scene.add(await createSkySphere({ r: 5000 }))
const sun = createSun({ pos: [500, 2000, 100], far: 5000 })
scene.add(sun)

const ground = await createHillyTerrain({ size: 10000, y: 100, factorX: 5, factorZ: 2.5, factorY: 350, file: 'terrain/grass.jpg' })
scene.add(ground)

const mesh = await loadModel({ file: 'airship/dirigible/model.fbx', size: 10 })
const zeppelin = new Zeppelin({ mesh })
// zeppelin.addSolids(ground) // BUG!

scene.add(zeppelin.mesh)
mesh.position.y = 256

const chaseCamera = new ChaseCamera({ camera, mesh, height: 10 })

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
