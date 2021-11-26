import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'

const controls = createOrbitControls()
let mixer, a = 0

// camera.position.set(0, 0, 1)
scene.background = new THREE.Color(0xffffff)

// monster.dae, wolf.dae
const loader = new ColladaLoader()
loader.load('/assets/models/monster/monster.dae', collada => {
  const { animations, scene: model } = collada
  mixer = new THREE.AnimationMixer(model)
  mixer.clipAction(animations[0]).play()
  controls.target = model.position
  scene.add(model)

  document.addEventListener('click', () => {
    const animation = animations[++a % animations.length]
    console.log(animation)
    mixer.clipAction(animation).play()
  })
})

void function render() {
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  requestAnimationFrame(render)
  controls.update()
  renderer.render(scene, camera)
}()
