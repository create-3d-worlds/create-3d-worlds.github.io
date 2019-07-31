import matrix from '../data/small-map.js'
import Tilemap from '../classes/Tilemap.js'
import Player from '../classes/Player.js'
import canvas from '../classes/Canvas.js'

const map = new Tilemap(matrix)
const player = new Player(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  canvas.renderMap(matrix, map.cellSize)
  canvas.renderPlayer(player)
}()
