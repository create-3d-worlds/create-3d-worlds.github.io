import PolarMaze from '/utils/mazes/PolarMaze.js'
import { recursiveBacktracker } from '/utils/mazes/algorithms.js'
import { scene, createToonRenderer, camera } from '/utils/scene.js'
import { createSun, ambLight } from '/utils/light.js'
import { createHill } from '/utils/ground.js'
import Avatar from '/utils/actor/Avatar.js'
import GUI, { avatarControls } from '/utils/io/GUI.js'

const rows = 20
const cellSize = 10
const mazeSize = rows * cellSize

const renderer = await createToonRenderer()

const hill = createHill(mazeSize * 2.05, 164)
scene.add(hill)

ambLight({ intensity: .6 })
const sun = createSun({ pos: [50, 150, 200] })
scene.add(sun)

const maze = new PolarMaze(rows, recursiveBacktracker, cellSize)
const city = maze.toCity({ texture: 'terrain/snow.jpg' })
scene.add(city)

const player = new Avatar({ camera, solids: [city, hill] })
player.chaseCamera.zoomIn()

scene.add(player.mesh)
player.putInPolarMaze(maze)

new GUI({ scoreTitle: '', controls: avatarControls })

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  player.update()
  renderer.render(scene, camera)
}()
