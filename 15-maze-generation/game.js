import Tilemap from '../models/Tilemap.js'
import Player from '../models/Player.js'
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
