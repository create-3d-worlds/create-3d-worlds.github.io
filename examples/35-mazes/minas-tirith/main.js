import PolarMaze from '/utils/mazes/PolarMaze.js'
import { recursiveBacktracker } from '/utils/mazes/algorithms.js'
import { scene, createToonRenderer, camera } from '/utils/scene.js'
import { createSun, ambLight } from '/utils/light.js'
import { createHill } from '/utils/ground.js'
import Avatar from '/utils/player/Avatar.js'

const gridSize = 20
const cellSize = 10
const citySize = gridSize * cellSize

const hill = createHill(citySize * 2.05, 164)
scene.add(hill)

ambLight({ intensity: .6 })
const sun = createSun({ position: [50, 150, 200] })
scene.add(sun)

const maze = new PolarMaze(gridSize, recursiveBacktracker, cellSize)
const city = maze.toCity({ texture: 'terrain/snow.jpg' })
scene.add(city)

const player = new Avatar({ size: .5, camera, solids: [city, hill] })
scene.add(player.mesh)
player.position.set(cellSize * .5, 0, -citySize - cellSize)
player.mesh.lookAt(0, 0, -citySize * 2)

const renderer = createToonRenderer()

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  player.update()
  renderer.render(scene, camera)
}()
