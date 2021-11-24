import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls} from '/utils/scene.js'
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js'

let mixer, a = 0

camera.position.set(50, 50, 50)
createOrbitControls()

const ambient = new THREE.AmbientLight(0xffffff)
scene.add(ambient)

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(75, 75, 75)
scene.add(spotLight)

const loader = new GLTFLoader()
loader.load('/assets/models/monster/monster.glb', collada => {
  const {animations, scene: model} = collada
  mixer = new THREE.AnimationMixer(model)
  mixer.clipAction(animations[2]).play()
  scene.add(model)

  document.addEventListener('click', () => {
    const animation = animations[++a % animations.length]
    mixer.clipAction(animation).play()
  })
})

void function render() {
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()
