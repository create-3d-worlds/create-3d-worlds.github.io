import * as THREE from '/node_modules/three/build/three.module.js'
import { scene, renderer, camera, createOrbitControls} from '/utils/scene.js'
import { ColladaLoader } from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js'

const controls = createOrbitControls()

camera.position.set(5, 1, 5)
scene.background = new THREE.Color(0xffffff)

const loader = new ColladaLoader()
// assets/models/morane-saulnier-L/model.dae
loader.load('/assets/models/s-e-5a/model.dae', collada => {
  const {scene: model} = collada
  controls.target = model.position
  scene.add(model)
})

void function render() {
  requestAnimationFrame(render)
  controls.update()
  renderer.render(scene, camera)
}()
