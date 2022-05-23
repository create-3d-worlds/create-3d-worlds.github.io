import * as THREE from '/node_modules/three119/build/three.module.js'
import { LegacyJSONLoader } from './libs/LegacyJSONLoader.js'

import game from './classes/GameEngine.js'
import Mine from './classes/Mine.js'
import Castle from './classes/Castle.js'
import Mob from './classes/Mob.js'
import Cloud from './classes/Cloud.js'
import Bird from './classes/creatures/Bird.js'
import Rabbit from './classes/creatures/Rabbit.js'
import { loadModel } from '/utils/loaders.js'

const jsonLoader = new LegacyJSONLoader()

const CASTLES = 1
const BIRDS = 10
const HORSES = 10
const CLOUDS = 5
const HOUSES = 3

game.init()
game.start()
game.plantTrees()

{
  const { mesh, animations } = await loadModel({ file: 'birds/flamingo.glb', size: 50, shouldCenter: true, shouldAdjustHeight: true })
  for (let i = 0; i < BIRDS; i++) game.addEntity(new Bird({ mesh, animations }))
}

{
  const { mesh } = await loadModel({ file: 'house-wizard-tower/model.dae', size: 5 })
  game.randomPlaceEntity(new Castle(mesh))
}

{
  const { mesh } = await loadModel({ file: 'nightelf-priest/model.dae', size: 1, shouldCenter: true, shouldAdjustHeight: true })
  for (let i = 0; i < CASTLES; i++) game.randomPlaceEntity(new Mob(game, mesh))
}

{
  const { mesh } = await loadModel({ file: 'animal-horse/horse.glb', size: 40, shouldCenter: true, shouldAdjustHeight: true })
  for (let i = 0; i < HORSES; i++) game.randomPlaceEntity(new Rabbit(mesh))
}

{
  const { mesh } = await loadModel({ file: 'houses/house2-01.obj', mtl: 'houses/house2-01.mtl', size: 60, shouldCenter: true, shouldAdjustHeight: true })
  for (let i = 0; i < HOUSES; i++) game.randomPlaceEntity(new Mine(mesh))
}

jsonLoader.load('assets/cloud.json', (geometry, materials) => {
  const mesh = new THREE.Mesh(geometry, materials)
  for (let i = 0; i < CLOUDS; i++) game.addEntity(new Cloud(mesh))
})

/* EVENTS */

document.getElementById('switch').addEventListener('click', () => game.switchCam())
