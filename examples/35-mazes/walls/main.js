import Maze from '/utils/mazes/Maze.js'
import { recursiveBacktracker } from '/utils/mazes/algorithms.js'
import { scene, renderer, camera } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { SorceressPlayer } from '/utils/actors/fantasy/Sorceress.js'

scene.add(createSun())
scene.add(createGround())

const maze = new Maze(4, 8, recursiveBacktracker, 3)
const walls = maze.toTiledMesh({ texture: 'walls/stonetiles.jpg', maxHeight: 6 })
scene.add(walls)

const player = new SorceressPlayer({ camera, solids: walls })
player.putInMaze(maze)
player.cameraFollow.aerialOffset = [0, 20, 0]
scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  player.update()
  renderer.render(scene, camera)
}()
