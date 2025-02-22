import { scene, renderer, camera } from '/core/scene.js'
import { createCityLights } from '/core/city.js'
import { createFloor } from '/core/ground.js'
import { hemLight } from '/core/light.js'
import { PartisanPlayer } from '/core/actor/derived/ww2/Partisan.js'
import Maze from '/core/mazes/Maze.js'
import { truePrims } from '/core/mazes/algorithms.js'
import GUI from '/core/io/GUI.js'

const cellSize = 15
const matrixSize = 15

hemLight({ intensity: Math.PI * 1.25 })
camera.position.set(0, 7, 10)

const maze = new Maze(matrixSize, matrixSize, truePrims, cellSize)
const city = maze.toCity()
scene.add(city)

const numCityLights = 2 // max is 16
const mapSize = cellSize * matrixSize * 2

const streetLights = createCityLights({ mapSize, numLights: numCityLights })
const floor = createFloor({ size: mapSize * 1.1, file: 'terrain/asphalt.jpg' })

scene.add(floor, streetLights)

const player = new PartisanPlayer({ camera, solids: city })
scene.add(player.mesh)

const gui = new GUI({ scoreTitle: 'Time', scoreClass: '', player })
gui.showMessage('Get out of the concrete jungle', true, 4000)

/* LOOP */

void function loop(time) {
  requestAnimationFrame(loop)
  player.update()

  gui.renderTime()
  gui.showBlinkingMessage({ message: 'Get out of the concrete jungle', time: time / 1000 })

  renderer.render(scene, camera)
}()
