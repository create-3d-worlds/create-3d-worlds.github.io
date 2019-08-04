import {scene, renderer, camera, createOrbitControls} from '../utils/3d-scene.js'
import {createFloor, createMap, createPlayerBox} from '../utils/3d-helpers.js'
import {nemesis as matrix} from '../data/maps.js'
import Player2D from '../classes/Player2D.js'
import Tilemap from '../classes/Tilemap.js'

const map = new Tilemap(matrix)
const player = new Player2D(map)
const controls = createOrbitControls()

// mesh is attached to Player2D class
player.mesh = createPlayerBox(player.y, player.x)

scene.add(createFloor(500, 500, 'ground.jpg'))
scene.add(createMap(matrix))
scene.add(player.mesh)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  player.update()
  controls.update()
  renderer.render(scene, camera)
}()
