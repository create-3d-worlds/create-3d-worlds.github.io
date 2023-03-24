import PolarMaze from '/utils/mazes/PolarMaze.js'
import { recursiveBacktracker } from '/utils/mazes/algorithms.js'
import { scene, renderer, camera } from '/utils/scene.js'
import { createSun, hemLight } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import Avatar from '/utils/player/Avatar.js'

hemLight({ intensity: .6 })
const sun = createSun()
scene.add(sun)

scene.add(createGround())

const maze = new PolarMaze(10, recursiveBacktracker, 5)
const pipes = maze.toPipes()
scene.add(pipes)

const player = new Avatar({ size: .4, camera, solids: pipes, jumpStyle: 'FLY_JUMP', maxJumpTime: 30 })
player.cameraFollow.distance = 2.5
scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  player.update()
  renderer.render(scene, camera)
}()
