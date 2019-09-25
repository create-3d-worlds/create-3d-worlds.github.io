import Tilemap from '/classes/Tilemap.js'
import Player2D from '/classes/2d/Player2D.js'
import generateMaze from '/utils/generateMaze.js'
import SmallMapRenderer from '/classes/2d/SmallMapRenderer.js'

const matrix = generateMaze(20, 20)
const smallMap = new Tilemap(matrix, 25)
const smallMapRenderer = new SmallMapRenderer(smallMap)
const player = new Player2D(smallMap)

/* LOOP */

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  smallMapRenderer.drawMap()
  smallMapRenderer.draw2DPlayer(player)
}()
