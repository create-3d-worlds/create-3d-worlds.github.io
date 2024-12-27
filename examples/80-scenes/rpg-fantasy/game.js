import { scene, createToonRenderer, camera } from '/core/scene.js'
import { createHillyTerrain } from '/core/ground.js'
import { createTreesOnTerrain } from '/core/geometry/trees.js'
import { createSun } from '/core/light.js'
import { sample, getEmptyCoords, putOnSolids } from '/core/helpers.js'
import { loadModel, Spinner } from '/core/loaders.js'

const mapSize = 400
const npcs = []

const spinner = new Spinner()
const renderer = await createToonRenderer()
camera.position.set(0, 50, 150)

const coords = getEmptyCoords({ mapSize: mapSize * .9, fieldSize: 5 })
scene.add(createSun({ pos: [15, 100, 50], intensity: 2 * Math.PI }))

const terrain = await createHillyTerrain({ size: mapSize, factorY: 30 })
scene.add(terrain)

const trees = createTreesOnTerrain({ terrain })
scene.add(trees)

renderer.render(scene, camera) // first draw

/* DYNAMIC IMPORT */

const castle = await loadModel({ file: 'building/castle/fortress.fbx', size: 40 })
putOnSolids(castle, terrain, -5)
scene.add(castle)

const solids = [terrain, castle]

const { BarbarianPlayer } = await import('/core/actor/derived/fantasy/Barbarian.js')
const player = new BarbarianPlayer({ pos: coords.pop(), mapSize, solids, camera, cameraClass: 'rpgui-button' })
scene.add(player.mesh)

const GUI = await import('/core/io/GUI.js')
const messageDict = {
  1: 'You just killed the first Orc.<br>Middle Earth shall be free!',
  10: 'You killed half the vile creatures',
  19: 'You smell victory in the air...',
}
const gui = new GUI.default({ subtitle: 'Orcs left', messageDict, controlsClass: 'rpgui-button', player, controls: { P: 'pause' } })

const orcs = ['Orc', 'OrcOgre']
for (let i = 0; i < 20; i++) {
  const name = sample(orcs)
  const obj = await import(`/core/actor/derived/fantasy/${name}.js`)
  const Enemy = obj[name + 'AI']
  const enemy = new Enemy({ pos: coords.pop(), target: player.mesh, mapSize, solids, shouldRaycastGround: true })
  npcs.push(enemy)
  scene.add(enemy.mesh)
}

const Potion = await import('/core/objects/Potion.js')
for (let i = 0; i < 3; i++) {
  const potion = new Potion.default({ pos: coords.pop(), solids })
  scene.add(potion.mesh)
}

const Monument = await import('/core/objects/Monument.js')
const monument = new Monument.default({ pos: coords.pop(), solids: terrain })
scene.add(monument.mesh)

const { FlamingoAI } = await import('/core/actor/derived/Flamingo.js')
for (let i = 0; i < 10; i++) {
  const bird = new FlamingoAI({ mapSize, pos: coords.pop() })
  npcs.push(bird)
  scene.add(bird.mesh)
}

const Cloud = await import('/core/objects/Cloud.js')
for (let i = 0; i < 5; i++) {
  const cloud = new Cloud.default({ mapSize, pos: coords.pop() })
  npcs.push(cloud)
  scene.add(cloud.mesh)
}

const { ZeppelinAI } = await import('/core/actor/derived/Zeppelin.js')
const airship = new ZeppelinAI({ mapSize, solids: terrain })
scene.add(airship.mesh)
npcs.push(airship)

const GameLoop = await import('/core/GameLoop.js')
spinner.hide()

/* LOOP */

const loop = new GameLoop.default(delta => {
  renderer.render(scene, camera)
  if (!npcs.length) return

  player.update(delta)
  npcs.forEach(enemy => enemy.update(delta))

  const killed = player.enemies.filter(enemy => enemy.userData.energy <= 0)
  gui?.renderScore(killed.length, player.enemies.length - killed.length)
}, false)

gui.showGameScreen({
  goals: ['Kill all the Orcs'],
  subtitle: 'Free the land<br>from their vile presence!',
  callback: () => loop.start(),
  autoClose: true
})