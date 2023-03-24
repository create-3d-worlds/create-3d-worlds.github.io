import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createHillyTerrain } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'
import { createSun } from '/utils/light.js'
import { sample, getAllCoords, putOnGround } from '/utils/helpers.js'
import { BarbarianPlayer } from '/utils/actors/fantasy/Barbarian.js'
import { OrcAI } from '/utils/actors/fantasy/Orc.js'
import { OrcOgreAI } from '/utils/actors/fantasy/OrcOgre.js'
import { FlamingoAI } from '/utils/actors/Flamingo.js'
import { CloudAI } from '/utils/actors/Cloud.js'
import { ZappelinAI } from '/utils/actors/Zappelin.js'
import { loadModel } from '/utils/loaders.js'

const mapSize = 400
const enemyClasses = [OrcAI, OrcOgreAI]
const npcs = []

const coords = getAllCoords({ mapSize: mapSize * .9, fieldSize: 5 })
scene.add(createSun({ position: [15, 100, 50] }))

const terrain = createHillyTerrain({ size: mapSize, factorY: 30 })
scene.add(terrain)

const trees = createTreesOnTerrain({ terrain })
scene.add(trees)

/* ACTORS */

const player = new BarbarianPlayer({ coords, mapSize, camera, solids: terrain })
scene.add(player.mesh)

for (let i = 0; i < 20; i++) {
  const Enemy = sample(enemyClasses)
  const enemy = new Enemy({ coords, solids: [terrain, player.mesh], target: player.mesh, mapSize, shouldRaycastGround: true })
  npcs.push(enemy)
  scene.add(enemy.mesh)
}

player.addSolids(npcs.map(enemy => enemy.mesh))

for (let i = 0; i < 10; i++) {
  const bird = new FlamingoAI({ mapSize, coords })
  npcs.push(bird)
  scene.add(bird.mesh)
}

for (let i = 0; i < 5; i++) {
  const cloud = new CloudAI({ mapSize })
  npcs.push(cloud)
  scene.add(cloud.mesh)
}

const { mesh: castle } = await loadModel({ file: 'building/castle/fortress.fbx', size: 40 })
putOnGround(castle, terrain, -5)
scene.add(castle)

player.addSolids(castle)

const airship = new ZappelinAI({ mapSize })
scene.add(airship.mesh)
npcs.push(airship)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)

  const delta = clock.getDelta()
  player.update(delta)
  npcs.forEach(enemy => enemy.update(delta))

  renderer.render(scene, camera)
}()
