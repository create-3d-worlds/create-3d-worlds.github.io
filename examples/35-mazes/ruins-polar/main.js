import PolarMaze from '/utils/mazes/PolarMaze.js'
import { recursiveBacktracker } from '/utils/mazes/algorithms.js'
import { scene, camera, createToonRenderer } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createDunes } from '/utils/ground.js'
import { ResistanceFighterPlayer } from '/utils/actors/ww2/ResistanceFighter.js'

const sun = createSun()
scene.add(sun)

const ground = createDunes({ size: 1000 })
scene.add(ground)

const maze = new PolarMaze(10, recursiveBacktracker, 10)
const ruins = maze.toRuins()
scene.add(ruins)

const player = new ResistanceFighterPlayer({ camera, solids: [ruins, ground] })
scene.add(player.mesh)

/* LOOP */

const renderer = createToonRenderer()

void function loop() {
  requestAnimationFrame(loop)
  player.update()
  renderer.render(scene, camera)
}()
