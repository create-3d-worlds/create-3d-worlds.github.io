// import * as THREE from '../node_modules/three/src/Three.js'
import {scene, renderer, camera, createOrbitControls} from '../utils/3d-scene.js'
import {createFloor, createMap} from '../utils/3d-helpers.js'
import matrix from '../data/small-map.js'

const controls = createOrbitControls()
scene.add(createFloor(500, 500, 'ground.jpg'))
scene.add(createMap(matrix))

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  controls.update()
  renderer.render(scene, camera)
}()
