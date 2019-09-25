import matrix from '/data/small-map.js'
import Tilemap from '/classes/Tilemap.js'
import Player2D from '/classes/2d/Player2D.js'
import SmallMapRenderer from '/classes/2d/SmallMapRenderer.js'

const map = new Tilemap(matrix, 30)
const player = new Player2D(map)
const smallMapRenderer = new SmallMapRenderer(matrix, 30, player)

/* LOOP */

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  smallMapRenderer.drawMap()
  smallMapRenderer.draw2DPlayerOnMap(player)
}()
