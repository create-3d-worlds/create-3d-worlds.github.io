import { scene, createToonRenderer, camera, clock } from '/utils/scene.js'
import Maze from '/utils/mazes/Maze.js'
import { recursiveDivision } from '/utils/mazes/algorithms.js'
import { hemLight } from '/utils/light.js'
import { createDunes } from '/utils/ground.js'
import { WitchPlayer } from '/utils/actor/derived/fantasy/Witch.js'

hemLight()

const maze = new Maze(10, 20, recursiveDivision, 10)
const ruins = maze.toMesh()
scene.add(ruins)

const dunes = await createDunes()
scene.add(dunes)

const renderer = await createToonRenderer()

const player = new WitchPlayer({ camera, solids: [dunes, ruins] })
player.chaseCamera.zoomIn()
scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  player.update(dt)
  renderer.render(scene, camera)
}()
