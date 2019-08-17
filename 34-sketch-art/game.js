import { scene, renderer, camera, createOrbitControls } from '../utils/scene.js'
import { createFloor } from '../utils/floor.js'
import { createSketchBox } from '../utils/shapes.js'
import {createSketchTrees} from '../utils/trees.js'

// scene.add(createSketchBox(50))

scene.background = new THREE.Color(0xccddff)
scene.fog = new THREE.Fog(0xccddff, 500, 2000)
const ambient = new THREE.AmbientLight(0xffffff)
scene.add(ambient)

camera.position.y = 100
createOrbitControls()

scene.add(createSketchTrees())
scene.add(createFloor(1000, false))

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
