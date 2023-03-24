import { scene, renderer, camera, setBackground } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { putInMaze } from '/utils/mazes.js'
import Maze from '/utils/mazes/Maze.js'
import { aldousBroder } from '/utils/mazes/algorithms.js'
import Avatar from '/utils/player/Avatar.js'
import { hemLight } from '/utils/light.js'
import { material, uniforms } from '/utils/shaders/lightning-led.js'

const cellSize = 3

hemLight()
setBackground(0)

scene.add(createFloor())

const maze = new Maze(10, 10, aldousBroder, cellSize)
const walls = maze.toTiledMesh({ maxHeight: cellSize * 3, material })
scene.add(walls)

const player = new Avatar({ size: .5, camera, solids: walls })
putInMaze(player.mesh, maze.tilemap, cellSize)
scene.add(player.mesh)

/* LOOP */

void function loop(time) {
  requestAnimationFrame(loop)
  uniforms.iTime.value = time * 0.0006
  player.update()
  renderer.render(scene, camera)
}()
