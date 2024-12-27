import { scene, camera, createToonRenderer, clock } from '/core/scene.js'
import PolarMaze from '/core/mazes/PolarMaze.js'
import { recursiveBacktracker } from '/core/mazes/algorithms.js'
import { createSun } from '/core/light.js'
import { createDunes } from '/core/ground.js'
import { ResistanceFighterPlayer } from '/core/actor/derived/ww2/ResistanceFighter.js'
import GUI from '/core/io/GUI.js'

const renderer = await createToonRenderer()

const sun = createSun({ intensity: Math.PI * 2 })
scene.add(sun)

const ground = await createDunes({ size: 1000 })
scene.add(ground)

const maze = new PolarMaze(10, recursiveBacktracker, 10)
const ruins = maze.toRuins()
scene.add(ruins)

const player = new ResistanceFighterPlayer({ camera, solids: [ruins, ground] })
player.putInPolarMaze(maze)
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
