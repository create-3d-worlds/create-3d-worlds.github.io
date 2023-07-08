import { scene, renderer, camera, setBackground } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import Maze from '/utils/mazes/Maze.js'
import { aldousBroder } from '/utils/mazes/algorithms.js'
import Avatar from '/utils/actor/Avatar.js'
import { hemLight } from '/utils/light.js'
import { material, uniforms } from '/utils/shaders/lightning-led.js'

const cellSize = 3

hemLight()
setBackground(0)
document.body.style.background = 'black'

scene.add(createFloor())

const maze = new Maze(10, 10, aldousBroder, cellSize)
const city = maze.toTiledMesh({ maxHeight: cellSize * 3, material })
scene.add(city)

const player = new Avatar({ size: .5, camera, solids: city })
player.chaseCamera.distance = 1.75
player.putInMaze(maze)
scene.add(player.mesh)

/* LOOP */

void function loop(timeStamp) {
  requestAnimationFrame(loop)
  uniforms.iTime.value = timeStamp * 0.0006
  player.update()
  renderer.render(scene, camera)
}()
