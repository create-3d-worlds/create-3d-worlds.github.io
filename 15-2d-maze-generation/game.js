import Tilemap from '../classes/Tilemap.js'
import Player from '../classes/Player.js'
import generateMaze from '../utils/generateMaze.js'
import canvas from '../classes/Canvas.js'

const maze = generateMaze(20, 20)
const map = new Tilemap(maze)
const player = new Player(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  canvas.renderMap(maze, map.cellSize)
  canvas.renderPlayer(player)
}()
