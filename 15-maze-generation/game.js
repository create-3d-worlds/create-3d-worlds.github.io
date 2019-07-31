import Tilemap from '../classes/Tilemap.js'
import Player from '../classes/Player.js'
import generateMaze from '../utils/generateMaze.js'

const maze = generateMaze(20, 20)
const map = new Tilemap(maze)
const player = new Player(map)
// console.table(maze)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  map.render()
  player.render()
}()
