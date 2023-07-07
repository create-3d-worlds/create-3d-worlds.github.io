import { scene, renderer, camera, createOrbitControls, clock } from '/utils/scene.js'
import Maze from '/utils/mazes/Maze.js'
import { huntAndKill } from '/utils/mazes/algorithms.js'
import Avatar from '/utils/actor/Avatar.js'
import { hemLight } from '/utils/light.js'
import { createMarble } from '/utils/ground.js'

const cellSize = 8
const matrixSize = 12

createOrbitControls()
hemLight()

scene.add(await createMarble({ size: cellSize * matrixSize * 2 }))

const maze = new Maze(matrixSize, matrixSize, huntAndKill, cellSize)
const pyramid = maze.toPyramid({ texture: 'walls/mayan.jpg' })
scene.add(pyramid)

const player = new Avatar({ speed: 2, camera, solids: pyramid, skin: 'LAVA' })
player.putInMaze(maze)
scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
