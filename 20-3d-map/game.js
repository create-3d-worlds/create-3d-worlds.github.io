import {scene, renderer, camera, createOrbitControls} from '../utils/three-scene.js'
import {createFloor, createMap} from '../utils/three-helpers.js'
import matrix from '../data/small-map.js'

camera.position.z = 15
camera.position.y = 10

const controls = createOrbitControls()
scene.add(createFloor(500, 500, 'ground.jpg'))
scene.add(createMap(matrix))

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  controls.update()
  renderer.render(scene, camera)
}()
