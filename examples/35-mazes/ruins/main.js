import Maze from '/utils/mazes/Maze.js'
import { scene, createToonRenderer, camera } from '/utils/scene.js'
import { recursiveDivision } from '/utils/mazes/algorithms.js'
import { hemLight } from '/utils/light.js'
import { createDunes } from '/utils/ground.js'
import { WitchPlayer } from '/utils/actors/fantasy/Witch.js'

hemLight()

const maze = new Maze(10, 20, recursiveDivision, 10)
const ruins = maze.toMesh()
scene.add(ruins)

const dunes = createDunes()
scene.add(dunes)

const renderer = createToonRenderer()

const player = new WitchPlayer({ camera, solids: [dunes, ruins] })
player.position = maze.cellPosition(0, 0)
player.lookAt(scene.position)
scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  player.update()
  renderer.render(scene, camera)
}()
