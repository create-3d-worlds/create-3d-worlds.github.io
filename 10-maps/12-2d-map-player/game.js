import matrix from '/data/small-map.js'
import Tilemap from '/classes/Tilemap.js'
import Player2D from '/classes/2d/Player2D.js'
import SmallMapRenderer from '/classes/2d/SmallMapRenderer.js'

const canvas = new SmallMapRenderer()
const map = new Tilemap(matrix, 30)
const player = new Player2D(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  canvas.drawMap(matrix, map.cellSize)
  canvas.draw2DPlayerOnMap(player)
}()
