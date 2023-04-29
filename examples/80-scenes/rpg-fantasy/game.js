import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createHillyTerrain } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'
import { createSun } from '/utils/light.js'
import { sample, getShuffledCoords, putOnSolids } from '/utils/helpers.js'
import { BarbarianPlayer } from '/utils/actor/child/fantasy/Barbarian.js'
import { OrcAI } from '/utils/actor/child/fantasy/Orc.js'
import { OrcOgreAI } from '/utils/actor/child/fantasy/OrcOgre.js'
import { FlamingoAI } from '/utils/actor/child/Flamingo.js'
import { ElephantAI } from '/utils/actor/child/Elephant.js'
import { ZeppelinAI } from '/utils/actor/child/Zeppelin.js'
import { loadModel } from '/utils/loaders.js'
import Cloud from '/utils/objects/Cloud.js'

const mapSize = 400
const npcs = []

const coords = getShuffledCoords({ mapSize: mapSize * .9, fieldSize: 5 })
scene.add(createSun({ pos: [15, 100, 50] }))

const terrain = await createHillyTerrain({ size: mapSize, factorY: 30 })
scene.add(terrain)

const trees = createTreesOnTerrain({ terrain })
scene.add(trees)

const castle = await loadModel({ file: 'building/castle/fortress.fbx', size: 40 })
putOnSolids(castle, terrain, -5)
scene.add(castle)

const solids = [terrain, castle]

/* ACTORS */

const airship = new ZeppelinAI({ mapSize, solids: terrain })
const elephant = new ElephantAI({ mapSize, pos: coords.pop(), solids, shouldRaycastGround: true })

scene.add(airship.mesh, elephant.mesh)
npcs.push(airship, elephant)

solids.push(elephant.mesh)

const player = new BarbarianPlayer({ pos: coords.pop(), mapSize, solids, camera })
scene.add(player.mesh)

for (let i = 0; i < 20; i++) {
  const Enemy = sample([OrcAI, OrcOgreAI])
  const enemy = new Enemy({ pos: coords.pop(), target: player.mesh, mapSize, solids, shouldRaycastGround: true })
  npcs.push(enemy)
  scene.add(enemy.mesh)
}

for (let i = 0; i < 10; i++) {
  const bird = new FlamingoAI({ mapSize, pos: coords.pop() })
  npcs.push(bird)
  scene.add(bird.mesh)
}

for (let i = 0; i < 5; i++) {
  const cloud = new Cloud({ mapSize, pos: coords.pop() })
  npcs.push(cloud)
  scene.add(cloud.mesh)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)

  const delta = clock.getDelta()
  player.update(delta)
  npcs.forEach(enemy => enemy.update(delta))

  renderer.render(scene, camera)
}()
