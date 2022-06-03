import Tilemap from '/classes/Tilemap.js'
import Player2D from '/classes/2d/Player2D.js'
import generateMaze from '/utils/maps.js'
import Map2DRenderer from '/classes/2d/Map2DRenderer.js'

const matrix = generateMaze(20, 20)

const smallMap = new Tilemap(matrix, 25)
const mapRenderer = new Map2DRenderer(smallMap)
const player = new Player2D(smallMap)

/* LOOP */

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  mapRenderer.drawMap()
  mapRenderer.draw2DPlayer(player)
}()
