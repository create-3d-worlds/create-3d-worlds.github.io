import { scene, renderer, camera } from '/utils/scene.js'
import { createCityLights } from '/utils/city.js'
import { createFloor } from '/utils/ground.js'
import { hemLight } from '/utils/light.js'
import { PartisanPlayer } from '/utils/actor/child/ww2/Partisan.js'
import Maze from '/utils/mazes/Maze.js'
import { truePrims } from '/utils/mazes/algorithms.js'

const cellSize = 10
const matrixSize = 15

hemLight({ intensity: 1.25 })
camera.position.set(0, 7, 10)

const maze = new Maze(matrixSize, matrixSize, truePrims)
const city = maze.toCity()
scene.add(city)

const numCityLights = 2 // max is 16
const mapSize = cellSize * matrixSize * 2

const streetLights = createCityLights({ mapSize, numLights: numCityLights })
const floor = createFloor({ size: mapSize * 1.1, color: 0x101018 })

scene.add(floor, streetLights)

const player = new PartisanPlayer({ camera, solids: city })
scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  player.update()
  renderer.render(scene, camera)
}()
