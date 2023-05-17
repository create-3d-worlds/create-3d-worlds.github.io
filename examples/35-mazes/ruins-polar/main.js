import PolarMaze from '/utils/mazes/PolarMaze.js'
import { scene, camera, createToonRenderer, clock } from '/utils/scene.js'
import { recursiveBacktracker } from '/utils/mazes/algorithms.js'
import { createSun } from '/utils/light.js'
import { createDunes } from '/utils/ground.js'
import { ResistanceFighterPlayer } from '/utils/actor/derived/ww2/ResistanceFighter.js'

const sun = createSun()
scene.add(sun)

const ground = await createDunes({ size: 1000 })
scene.add(ground)

const maze = new PolarMaze(10, recursiveBacktracker, 10)
const ruins = maze.toRuins()
scene.add(ruins)

const player = new ResistanceFighterPlayer({ camera, solids: [ruins, ground] })
player.putInPolarMaze(maze)
scene.add(player.mesh)

/* LOOP */

const renderer = await createToonRenderer()

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  player.update(dt)
  renderer.render(scene, camera)
}()
