import * as THREE from '../node_modules/three/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls} from '../utils/scene.js'
import {ColladaLoader} from '../node_modules/three/examples/jsm/loaders/ColladaLoader.js'

createOrbitControls()
const actions = {}
let mixer

const loader = new ColladaLoader()
loader.load('../assets/models/monster.dae', collada => {
  mixer = new THREE.AnimationMixer(collada.scene)
  collada.animations.forEach(clip => {
    actions[clip.name] = mixer.clipAction(clip)
  })
  const currentAction = actions[Object.keys(actions)[0]]
  currentAction.play()
  scene.add(collada.scene)
})

void function render() {
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()
