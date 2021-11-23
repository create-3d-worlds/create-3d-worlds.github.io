import * as THREE from '/node_modules/three/build/three.module.js'
import { scene, renderer, camera, createOrbitControls} from '/utils/scene.js'
import { ColladaLoader } from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js'
import {createTerrain} from '/utils/floor.js'

const loader = new ColladaLoader()

const controls = createOrbitControls()
controls.minDistance = 5

const terrain = createTerrain()
scene.add(terrain)
scene.background = new THREE.Color(0xe0f0ff)

camera.position.set(0, 20, 40)

let zoomedIn = false

loader.load('/assets/models/s-e-5a/model.dae', collada => {
  const {scene: model} = collada
  model.position.set(100, 50, -50)
  controls.target = model.position
  scene.add(model)
})

void function animate() {
  requestAnimationFrame(animate)
  controls.update()

  // interpolate camera toward target
  if (!zoomedIn && camera.position.distanceTo(controls.target) > controls.minDistance)
    camera.position.lerp(controls.target, 0.05)

  if (!zoomedIn && camera.position.distanceTo(controls.target) <= controls.minDistance)
    zoomedIn = true // stop zooming in

  renderer.render(scene, camera)
}()
