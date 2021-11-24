import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, renderer, camera, createOrbitControls} from '/utils/scene.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import {createFloor} from '/utils/floor.js'

let model

const controls = createOrbitControls()
controls.maxPolarAngle = Math.PI / 2 // prevent bellow ground
// controls.minDistance = 5
const loader = new ColladaLoader()

const terrain = createFloor(5000)
scene.add(terrain)
scene.background = new THREE.Color(0xe0f0ff)

const camPos = new THREE.Vector3(0, 80, 40)

loader.load('/assets/models/s-e-5a/model.dae', collada => {
  model = collada.scene
  model.rotateZ(Math.PI)
  model.position.set(0, 10, 0)
  controls.target = model.position
  model.add(camera)
  // camera.position.y -= 200
  // camera.lookAt(model.position)
  scene.add(model)
})

void function animate() {
  requestAnimationFrame(animate)
  // controls.update()

  // interpolate camera toward target
  // if (camPos.distanceTo(controls.target) > controls.minDistance * 2) {
  //   camPos.lerp(controls.target, 0.03)
  //   camera.position.copy(camPos)
  // }

  if (model) {
    model.position.z+=.1
  }

  renderer.render(scene, camera)
}()
