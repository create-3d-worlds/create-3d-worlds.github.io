import * as THREE from '/node_modules/three108/build/three.module.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'

let mixer
let theta = 0

dirLight({ color: 0xefefff, intensity: 1.5 })

const loader = new GLTFLoader()
loader.load('/assets/models/horse.glb', ({ scene: model, animations }) => {
  model.scale.set(1.5, 1.5, 1.5)
  scene.add(model)
  console.log(animations)
  mixer = new THREE.AnimationMixer(model)
  mixer.clipAction(animations[0]).setDuration(1).play()
})

function rotateCamera() {
  const radius = 600
  theta += 0.1
  camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta))
  camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta))
  camera.lookAt(new THREE.Vector3(0, 200, 0))
}

void function animate() {
  requestAnimationFrame(animate)
  rotateCamera()
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  renderer.render(scene, camera)
}()
