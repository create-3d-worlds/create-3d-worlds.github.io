import PolarMaze from '/utils/mazes/PolarMaze.js'
import { recursiveBacktracker } from '/utils/mazes/algorithms.js'
import { scene, renderer, camera } from '/utils/scene.js'
import { createSun, hemLight } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import Avatar from '/utils/actor/Avatar.js'
import GUI, { avatarControls } from '/utils/io/GUI.js'

hemLight()
const sun = createSun({ intensity: Math.PI * .6 })
scene.add(sun)

scene.add(createGround())

const maze = new PolarMaze(10, recursiveBacktracker, 10)
const pipes = maze.toPipes()
scene.add(pipes)

const player = new Avatar({ camera, solids: pipes, maxJumpTime: .45 })
player.chaseCamera.distance = 4.5
player.chaseCamera.zoomIn()
scene.add(player.mesh)

new GUI({ scoreTitle: '', controls: avatarControls })

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  player.update()
  renderer.render(scene, camera)
}()
