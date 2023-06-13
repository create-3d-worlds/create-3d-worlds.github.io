import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createHillyTerrain } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'
import { createSun } from '/utils/light.js'
import { sample, getEmptyCoords, putOnSolids } from '/utils/helpers.js'
import { BarbarianPlayer } from '/utils/actor/derived/fantasy/Barbarian.js'
import { OrcAI } from '/utils/actor/derived/fantasy/Orc.js'
import { OrcOgreAI } from '/utils/actor/derived/fantasy/OrcOgre.js'
import { FlamingoAI } from '/utils/actor/derived/Flamingo.js'
import { ZeppelinAI } from '/utils/actor/derived/Zeppelin.js'
import { loadModel } from '/utils/loaders.js'
import Cloud from '/utils/objects/Cloud.js'

const mapSize = 400
const npcs = []

const coords = getEmptyCoords({ mapSize: mapSize * .9, fieldSize: 5 })
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

scene.add(airship.mesh)
npcs.push(airship)

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
