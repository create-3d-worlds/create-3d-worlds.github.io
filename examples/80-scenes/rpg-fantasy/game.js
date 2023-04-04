import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createHillyTerrain } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'
import { createSun } from '/utils/light.js'
import { sample, getShuffledCoords, putOnTerrain } from '/utils/helpers.js'
import { BarbarianPlayer } from '/utils/actor/fantasy/Barbarian.js'
import { OrcAI } from '/utils/actor/fantasy/Orc.js'
import { OrcOgreAI } from '/utils/actor/fantasy/OrcOgre.js'
import { FlamingoAI } from '/utils/actor/Flamingo.js'
import { ElephantAI } from '/utils/actor/Elephant.js'
import { CloudAI } from '/utils/actor/Cloud.js'
import { ZappelinAI } from '/utils/actor/Zappelin.js'
import { loadModel } from '/utils/loaders.js'

const mapSize = 400
const npcs = []

const coords = getShuffledCoords({ mapSize: mapSize * .9, fieldSize: 5 })
scene.add(createSun({ position: [15, 100, 50] }))

const terrain = createHillyTerrain({ size: mapSize, factorY: 30 })
scene.add(terrain)

const trees = createTreesOnTerrain({ terrain })
scene.add(trees)

/* ACTORS */

const player = new BarbarianPlayer({ pos: coords.pop(), mapSize, camera, solids: terrain })
scene.add(player.mesh)

for (let i = 0; i < 20; i++) {
  const Enemy = sample([OrcAI, OrcOgreAI])
  const enemy = new Enemy({ pos: coords.pop(), target: player.mesh, mapSize, solids: [terrain], shouldRaycastGround: true })
  npcs.push(enemy)
  scene.add(enemy.mesh)
}

player.addSolids(npcs.map(enemy => enemy.mesh))

for (let i = 0; i < 10; i++) {
  const bird = new FlamingoAI({ mapSize, pos: coords.pop() })
  npcs.push(bird)
  scene.add(bird.mesh)
}

for (let i = 0; i < 5; i++) {
  const cloud = new CloudAI({ mapSize, pos: coords.pop() })
  npcs.push(cloud)
  scene.add(cloud.mesh)
}

const { mesh: castle } = await loadModel({ file: 'building/castle/fortress.fbx', size: 40 })
putOnTerrain(castle, terrain, -5)
scene.add(castle)

const elephant = new ElephantAI({ mapSize, pos: coords.pop(), solids: [terrain], shouldRaycastGround: true })
player.addSolids(castle, elephant.mesh)

const airship = new ZappelinAI({ mapSize })
scene.add(airship.mesh, elephant.mesh)
npcs.push(airship, elephant)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)

  const delta = clock.getDelta()
  player.update(delta)
  npcs.forEach(enemy => enemy.update(delta))

  renderer.render(scene, camera)
}()
