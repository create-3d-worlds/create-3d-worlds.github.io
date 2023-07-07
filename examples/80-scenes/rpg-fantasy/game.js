import { scene, createToonRenderer, camera, clock } from '/utils/scene.js'
import { createHillyTerrain } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'
import { createSun } from '/utils/light.js'
import { sample, getEmptyCoords, putOnSolids } from '/utils/helpers.js'
import { loadModel, Spinner } from '/utils/loaders.js'

let player, score
const mapSize = 400
const npcs = []

const spinner = new Spinner()
const renderer = await createToonRenderer()
camera.position.set(0, 50, 150)

const coords = getEmptyCoords({ mapSize: mapSize * .9, fieldSize: 5 })
scene.add(createSun({ pos: [15, 100, 50] }))

const terrain = await createHillyTerrain({ size: mapSize, factorY: 30 })
scene.add(terrain)

const trees = createTreesOnTerrain({ terrain })
scene.add(trees)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
  if (!player) return

  const delta = clock.getDelta()
  player.update(delta)
  npcs.forEach(enemy => enemy.update(delta))

  const killed = player.enemies.filter(enemy => enemy.userData.energy <= 0)
  score?.render(killed.length, player.enemies.length - killed.length)
}()

/* LAZY LOAD */

const castle = await loadModel({ file: 'building/castle/fortress.fbx', size: 40 })
putOnSolids(castle, terrain, -5)
scene.add(castle)

const solids = [terrain, castle]

const { BarbarianPlayer } = await import('/utils/actor/derived/fantasy/Barbarian.js')
player = new BarbarianPlayer({ pos: coords.pop(), mapSize, solids, camera, orbitControls: true })
scene.add(player.mesh)

const orcs = ['Orc', 'OrcOgre']
for (let i = 0; i < 20; i++) {
  const name = sample(orcs)
  const obj = await import(`/utils/actor/derived/fantasy/${name}.js`)
  const Enemy = obj[name + 'AI']
  const enemy = new Enemy({ pos: coords.pop(), target: player.mesh, mapSize, solids, shouldRaycastGround: true })
  npcs.push(enemy)
  scene.add(enemy.mesh)
}

const obj = await import('/utils/objects/Potion.js')
for (let i = 0; i < 3; i++) {
  const potion = new obj.default({ pos: coords.pop(), solids })
  scene.add(potion.mesh)
}

const scoreFile = await import('/utils/io/Score.js')
const messageDict = {
  1: 'You killed the first Orc.<br>Free the land from their vile presence!',
  10: 'You killed half the vile creatures',
  19: 'You smell victory in the air...',
}
score = new scoreFile.default({ title: 'Orcs killed', subtitle: 'Orcs left', messageDict })

const monument = await loadModel({ file: 'building/monument/knight/knight.fbx', size: 5, shouldAdjustHeight: true, shouldCenter: true })
monument.position.copy(coords.pop())
putOnSolids(monument, terrain)
scene.add(monument)

const { FlamingoAI } = await import('/utils/actor/derived/Flamingo.js')
for (let i = 0; i < 10; i++) {
  const bird = new FlamingoAI({ mapSize, pos: coords.pop() })
  npcs.push(bird)
  scene.add(bird.mesh)
}

const cloudFile = await import('/utils/objects/Cloud.js')
for (let i = 0; i < 5; i++) {
  const cloud = new cloudFile.default({ mapSize, pos: coords.pop() })
  npcs.push(cloud)
  scene.add(cloud.mesh)
}

const { ZeppelinAI } = await import('/utils/actor/derived/Zeppelin.js')
const airship = new ZeppelinAI({ mapSize, solids: terrain })
scene.add(airship.mesh)
npcs.push(airship)

spinner.hide()