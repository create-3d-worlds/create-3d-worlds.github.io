import {scene, controls, renderer, camera} from '../utils/3d-scene.js'
import {createFloor, createMap, createBox} from '../utils/3d-helpers.js'
import matrix from '../data/small-map.js'
import Player from '../classes/Player.js'
import Tilemap from '../classes/Tilemap.js'

const map = new Tilemap(matrix)
const player = new Player(map)

const playerMesh = createBox(player.y, player.x)
playerMesh.vertexColors = THREE.FaceColors
playerMesh.geometry.faces[0].color.set('black')
playerMesh.geometry.faces[1].color.set('black')

scene.add(createFloor(500, 500, 'ground.jpg'))
scene.add(createMap(matrix))
scene.add(playerMesh)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()

  playerMesh.position.z = player.y
  playerMesh.position.x = player.x
  playerMesh.rotation.y = -player.angle

  controls.update()
  renderer.render(scene, camera)
}()
