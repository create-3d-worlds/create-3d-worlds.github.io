// import * as THREE from '../node_modules/three/src/Three.js'
import {scene, controls, renderer, camera} from '../utils/3d-scene.js'
import {createFloor, createMap, createSphere} from '../utils/3d-helpers.js'
import matrix from '../data/small-map.js'
import Player from '../classes/Player.js'
import Tilemap from '../classes/Tilemap.js'

const map = new Tilemap(matrix)
const player = new Player(map)

const playerBox = createSphere(player.y, player.x)

scene.add(createFloor(500, 500, 'ground.jpg'))
scene.add(createMap(matrix))
scene.add(playerBox)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  controls.update()
  // render player
  renderer.render(scene, camera)
}()
