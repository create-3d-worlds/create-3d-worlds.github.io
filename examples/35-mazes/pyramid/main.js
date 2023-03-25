import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import Maze from '/utils/mazes/Maze.js'
import { huntAndKill } from '/utils/mazes/algorithms.js'
import Avatar from '/utils/player/Avatar.js'
import { hemLight } from '/utils/light.js'
import { createMarble } from '/utils/ground.js'

scene.add(createMarble())

const cellSize = 3

createOrbitControls()
hemLight()

const maze = new Maze(12, 12, huntAndKill, cellSize)
const pyramid = maze.toPyramid({ texture: 'walls/mayan.jpg' })
scene.add(pyramid)

const player = new Avatar({ size: .5, speed: 2, camera, solids: pyramid })
maze.putPlayer(player.mesh)
scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  player.update()
  renderer.render(scene, camera)
}()
