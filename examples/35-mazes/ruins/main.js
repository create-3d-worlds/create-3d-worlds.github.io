import { scene, createToonRenderer, camera, clock } from '/core/scene.js'
import Maze from '/core/mazes/Maze.js'
import { recursiveDivision } from '/core/mazes/algorithms.js'
import { hemLight } from '/core/light.js'
import { createDunes } from '/core/ground.js'
import { WitchPlayer } from '/core/actor/derived/fantasy/Witch.js'
import GUI from '/core/io/GUI.js'

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

new GUI({ scoreTitle: '', player })

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  player.update(dt)
  renderer.render(scene, camera)
}()
