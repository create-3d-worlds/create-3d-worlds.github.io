import matrix from '/data/small-map.js'
import Tilemap from '/classes/Tilemap.js'
import MapPlayer from '/classes/2d/MapPlayer.js'
import Canvas from '/classes/2d/Canvas.js'

const canvas = new Canvas()
const map = new Tilemap(matrix, 30)
const player = new MapPlayer(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  canvas.drawMap(matrix, map.cellSize)
  canvas.draw2DPlayerOnMap(player)
}()
