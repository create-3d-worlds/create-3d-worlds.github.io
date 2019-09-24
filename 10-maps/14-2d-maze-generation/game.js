import Tilemap from '/classes/Tilemap.js'
import Player2D from '/classes/2d/Player2D.js'
import generateMaze from '/utils/generateMaze.js'
import SmallMapRenderer from '/classes/2d/SmallMapRenderer.js'

const matrix = generateMaze(20, 20)
const map = new Tilemap(matrix, 25)
const mapRenderer = new SmallMapRenderer(matrix, 25)
const player = new Player2D(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  mapRenderer.drawMap()
  mapRenderer.draw2DPlayerOnMap(player)
}()
