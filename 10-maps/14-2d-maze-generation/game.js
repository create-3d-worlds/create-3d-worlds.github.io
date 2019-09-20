import Tilemap3D from '/classes/Tilemap3D.js'
import Player2D from '/classes/2d/Player2D.js'
import generateMaze from '/utils/generateMaze.js'
import Canvas from '/classes/2d/Canvas.js'

const canvas = new Canvas()
const maze = generateMaze(20, 20)
const map = new Tilemap3D(maze, 25)
const player = new Player2D(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  canvas.drawMap(maze, map.cellSize)
  canvas.draw2DPlayerOnMap(player)
}()
