import matrix from '/data/small-map.js'
import Tilemap3D from '/classes/Tilemap3D.js'
import Player2D from '/classes/2d/Player2D.js'
import Canvas from '/classes/2d/Canvas.js'

const canvas = new Canvas()
const map = new Tilemap3D(matrix, 30)
const player = new Player2D(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  canvas.drawMap(matrix, map.cellSize)
  canvas.draw2DPlayerOnMap(player)
}()
