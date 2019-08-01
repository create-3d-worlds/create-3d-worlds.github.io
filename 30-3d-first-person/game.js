import {scene, renderer, camera} from '../utils/3d-scene.js'
import {createFloor, createMap, createBox} from '../utils/3d-helpers.js'
import matrix from '../data/small-map.js'
import Player from '../classes/Player.js'
import Tilemap from '../classes/Tilemap.js'
// import generateMaze from '../utils/generateMaze.js'
// const matrix = generateMaze(20, 20)

const map = new Tilemap(matrix)
const player = new Player(map)

const playerMesh = createBox(player.y, player.x)
playerMesh.geometry.faces[0].color.set('black')
playerMesh.geometry.faces[1].color.set('black')
playerMesh.add(camera)
player.mesh = playerMesh

scene.add(createFloor(500, 500, 'ground.jpg'))
scene.add(createMap(matrix))
scene.add(playerMesh)

camera.position.z = player.x
camera.position.y = player.y
console.log(camera.position)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  camera.lookAt(playerMesh.position)
  player.update()
  renderer.render(scene, camera)
}()
