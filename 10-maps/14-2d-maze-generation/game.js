import Tilemap from '/classes/Tilemap.js'
import MapPlayer from '/classes/2d/MapPlayer.js'
import generateMaze from '/utils/generateMaze.js'
import Canvas from '/classes/2d/Canvas.js'

const canvas = new Canvas()
const maze = generateMaze(20, 20)
const map = new Tilemap(maze, 25)
const player = new MapPlayer(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  canvas.drawMap(maze, map.cellSize)
  canvas.draw2DPlayerOnMap(player)
}()
