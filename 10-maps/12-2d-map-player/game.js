import matrix from '/data/small-map.js'
import Tilemap from '/classes/2d/Tilemap.js'
import Player2D from '/classes/2d/Player2D.js'
import canvas from '/classes/2d/Canvas.js'

const map = new Tilemap(matrix)
const player = new Player2D(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  canvas.renderMap(matrix, map.cellSize)
  canvas.renderPlayer(player)
}()
