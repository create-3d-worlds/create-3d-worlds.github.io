import {scene, fpControls, renderer, camera, clock} from '../utils/3d-scene.js'
import {createFloor, createMap, createBox} from '../utils/3d-helpers.js'
import matrix from '../data/small-map.js'
import Player from '../classes/Player.js'
import Tilemap from '../classes/Tilemap.js'
// import generateMaze from '../utils/generateMaze.js'
// const matrix = generateMaze(20, 20)

const map = new Tilemap(matrix)
const player = new Player(map)

const playerMesh = createBox(player.y, player.x)
playerMesh.vertexColors = THREE.FaceColors
playerMesh.geometry.faces[0].color.set('black')
playerMesh.geometry.faces[1].color.set('black')
playerMesh.add(camera)

scene.add(createFloor(500, 500, 'ground.jpg'))
scene.add(createMap(matrix))
scene.add(playerMesh)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  const delta = clock.getDelta()
  player.update()

  playerMesh.position.z = player.y
  playerMesh.position.x = player.x
  playerMesh.rotation.y = -player.angle

  // fpControls.update(delta)
  renderer.render(scene, camera)
}()
