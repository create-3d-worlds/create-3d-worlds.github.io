import * as THREE from '/node_modules/three/build/three.module.js'
import { scene, renderer, camera, createOrbitControls} from '/utils/scene.js'
import { ColladaLoader } from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js'
import {createTerrain} from '/utils/floor.js'

const controls = createOrbitControls()

const terrain = createTerrain()
scene.add(terrain)

camera.position.z = 40
camera.position.y = 20
scene.background = new THREE.Color(0xffffff)

const loader = new ColladaLoader()
// assets/models/morane-saulnier-L/model.dae
loader.load('/assets/models/s-e-5a/model.dae', collada => {
  const {scene: model} = collada
  model.position.set(100, 50, -50)
  controls.target = model.position // centar kamere
  controls.maxDistance = 20
  scene.add(model)
})

void function render() {
  requestAnimationFrame(render)
  controls.update()
  renderer.render(scene, camera)
}()
