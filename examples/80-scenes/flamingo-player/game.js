import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createHillyTerrain } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'
import { createSun } from '/utils/light.js'
import { sample, getAllCoords } from '/utils/helpers.js'
import { OrcAI } from '/utils/actors/fantasy/Orc.js'
import { OrcOgreAI } from '/utils/actors/fantasy/OrcOgre.js'
import { FlamingoAI, FlamingoPlayer } from '/utils/actors/Flamingo.js'

const mapSize = 200
const coords = getAllCoords({ mapSize: mapSize * .9, fieldSize: 5 })
scene.add(createSun())

const terrain = createHillyTerrain({ size: mapSize, segments: 20 })
scene.add(terrain)

const trees = createTreesOnTerrain({ terrain })
scene.add(trees)

const player = new FlamingoPlayer({ coords, mapSize, camera, solids: terrain })
scene.add(player.mesh)

const enemyClasses = [OrcAI, OrcOgreAI]

const enemies = []
for (let i = 0; i < 10; i++) {
  const EnemyClass = sample(enemyClasses)
  const enemy = new EnemyClass({ coords, solids: terrain, target: player.mesh, mapSize, shouldRaycastGround: true })
  enemies.push(enemy)
  scene.add(enemy.mesh)
}

const enemyMeshes = enemies.map(e => e.mesh)
player.addSolids(enemyMeshes)

const birds = []
for (let i = 0; i < 10; i++) {
  const bird = new FlamingoAI({ mapSize, coords })
  birds.push(bird)
  scene.add(bird.mesh)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)

  const delta = clock.getDelta()
  player.update(delta)
  enemies.forEach(enemy => enemy.update(delta))
  birds.forEach(bird => bird.update(delta))

  renderer.render(scene, camera)
}()
