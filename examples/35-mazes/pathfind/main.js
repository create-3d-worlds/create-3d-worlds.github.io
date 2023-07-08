import { scene, renderer, camera } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'
import Player from '/utils/actor/Player.js'
import { createGround } from '/utils/ground.js'
import Maze from '/utils/mazes/Maze.js'
import { createPlayerBox } from '/utils/geometry/index.js'

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
