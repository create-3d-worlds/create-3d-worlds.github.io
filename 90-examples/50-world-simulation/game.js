import * as THREE from '/node_modules/three108/build/three.module.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { LegacyJSONLoader } from './libs/LegacyJSONLoader.js'

import game from './classes/GameEngine.js'
import Mine from './classes/Mine.js'
import Castle from './classes/Castle.js'
import Mob from './classes/Mob.js'
import Cloud from './classes/Cloud.js'
import Bird from './classes/creatures/Bird.js'
import Rabbit from './classes/creatures/Rabbit.js'

const gltfLoader = new GLTFLoader()
const daeLoader = new ColladaLoader()
const jsonLoader = new LegacyJSONLoader()

const MOBS = 1
const BIRDS = 10
const RABBITS = 10
const CLOUDS = 5
const MINES = 2

game.init()
game.start()
game.plantTrees()

gltfLoader.load('/assets/models/ptice/flamingo.glb', model => {
  for (let i = 0; i < BIRDS; i++) game.addEntity(new Bird(model))
})

daeLoader.load('/assets/models/wildsgate-keep/model.dae', model => {
  game.randomPlaceEntity(new Castle(model))
})

daeLoader.load('/assets/models/nightelf-priest/model.dae', model => {
  for (let i = 0; i < MOBS; i++) game.randomPlaceEntity(new Mob(game, model))
})

daeLoader.load('/assets/models/rabbit.dae', model => {
  for (let i = 0; i < RABBITS; i++) game.randomPlaceEntity(new Rabbit(model))
})

jsonLoader.load('assets/mine.json', (geometry, materials) => {
  const mesh = new THREE.Mesh(geometry, materials)
  for (let i = 0; i < MINES; i++) game.randomPlaceEntity(new Mine(mesh))
})

jsonLoader.load('assets/cloud.json', (geometry, materials) => {
  const mesh = new THREE.Mesh(geometry, materials)
  for (let i = 0; i < CLOUDS; i++) game.addEntity(new Cloud(mesh))
})

/* EVENTS */

document.getElementById('switch').addEventListener('click', () => game.switchCam())
