import matrix from '/data/small-map.js'
import Tilemap from '/classes/Tilemap.js'
import Player2D from '/classes/2d/Player2D.js'
import Map2DRenderer from '/classes/2d/Map2DRenderer.js'

const smallMap = new Tilemap(matrix, 30)
const player = new Player2D(smallMap)
const mapRenderer = new Map2DRenderer(smallMap)

/* LOOP */

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  mapRenderer.drawMap()
  mapRenderer.draw2DPlayer(player)
}()
