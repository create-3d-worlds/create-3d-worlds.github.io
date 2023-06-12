import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'
import Player from '/utils/actor/Player.js'
import { createGround } from '/utils/ground.js'
import Maze from '/utils/mazes/Maze.js'
import { createPlayerBox } from '/utils/geometry/index.js'

hemLight()
scene.add(createGround())

camera.position.set(0, 7, 10)
const controls = createOrbitControls()

const maze = new Maze(10, 10)
maze.distances = maze.cell(0, 0).distances.path_to(maze.last_cell)

const walls = maze.toTiledMesh({ renderPath: true })
scene.add(walls)

const player = new Player({ solids: walls, mesh: createPlayerBox() })
player.putInMaze(maze)

scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  controls.update()
  player.update()
  renderer.render(scene, camera)
}()
