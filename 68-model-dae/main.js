import * as THREE from '../node_modules/three/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls} from '../utils/scene.js'
import {ColladaLoader} from '../node_modules/three/examples/jsm/loaders/ColladaLoader.js'

createOrbitControls()
let mixer

const loader = new ColladaLoader()
loader.load('../assets/models/monster.dae', collada => {
  const {animations, scene: model} = collada
  mixer = new THREE.AnimationMixer(model)
  mixer.clipAction(animations[0]).play()
  scene.add(model)
})

void function render() {
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()
