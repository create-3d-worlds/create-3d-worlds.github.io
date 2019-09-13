import matrix from '/data/small-map.js'
import Tilemap from '/classes/Tilemap.js'
import Player2D from '/classes/Player2D.js'
import canvas from '/classes/Canvas.js'

const map = new Tilemap(matrix)
const player = new Player2D(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  canvas.renderMap(matrix, map.cellSize)
  canvas.renderPlayer(player)
}()
