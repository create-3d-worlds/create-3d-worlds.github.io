import { scene, renderer, camera } from '/core/scene.js'
import { hemLight } from '/core/light.js'
import Player from '/core/actor/Player.js'
import { createGround } from '/core/ground.js'
import Maze from '/core/mazes/Maze.js'
import { createPlayerBox } from '/core/geometry/index.js'

hemLight()
scene.add(createGround())

const maze = new Maze(10, 10)
maze.distances = maze.cell(0, 0).distances.path_to(maze.last_cell)

const walls = maze.toTiledMesh({ renderPath: true })
scene.add(walls)

const player = new Player({ camera, solids: walls, mesh: createPlayerBox(), showHealthBar: false })
player.putInMaze(maze)
player.chaseCamera.distance = 2

scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  player.update()
  renderer.render(scene, camera)
}()
