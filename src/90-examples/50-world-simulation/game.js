import game from './classes/GameEngine.js'
import Mine from './classes/Mine.js'
import Entity from './classes/Entity.js'
import Mob from './classes/Mob.js'
import Cloud from './classes/Cloud.js'
import Bird from './classes/creatures/Bird.js'
import Rabbit from './classes/creatures/Rabbit.js'
import { loadModel } from '/utils/loaders.js'

const HUNTERS = 2
const BIRDS = 10
const HORSES = 10
const CLOUDS = 5
const MINES = 3

game.init()
game.start()
game.plantTrees()

let res

res = await loadModel({ file: 'animal/flamingo.glb', size: 60, shouldAjust: true })
for (let i = 0; i < BIRDS; i++)
  game.addEntity(new Bird(res))

res = await loadModel({ file: 'castle/wizard-isle/scene.gltf', size: 200, shouldAjust: true })
const castle = new Entity(res.mesh)
castle.name = 'vilage'
game.randomPlaceEntity(castle)

res = await loadModel({ file: 'character/ogro/ogro.md2', texture: 'character/ogro/skins/arboshak.png', size: 50, rot: { axis: [0, 1, 0], angle: -Math.PI * .5 }, shouldAjust: true })
for (let i = 0; i < HUNTERS; i++)
  game.randomPlaceEntity(new Mob({ game, ...res }))

res = await loadModel({ file: 'animal/horse.glb', size: 40, shouldAjust: true })
for (let i = 0; i < HORSES; i++)
  game.randomPlaceEntity(new Rabbit(res))

res = await loadModel({ file: 'building/mine/scene.gltf', size: 60 })
for (let i = 0; i < MINES; i++)
  game.randomPlaceEntity(new Mine(res.mesh))

res = await loadModel({ file: 'cloud/scene.gltf', size: 2 })
for (let i = 0; i < CLOUDS; i++)
  game.addEntity(new Cloud(res.mesh))

/* EVENTS */

document.getElementById('switch').addEventListener('click', () => game.switchCam())
