import * as THREE from '/node_modules/three108/build/three.module.js'
import { GLTFLoader } from '/node_modules/three108/examples/jsm/loaders/GLTFLoader.js'
import { scene, camera, renderer } from '/utils/scene.js'

let mesh, mixer
const radius = 600
let theta = 0
let prevTime = Date.now()

camera.target = new THREE.Vector3(0, 150, 0)

const light = new THREE.DirectionalLight(0xefefff, 1.5)
light.position.set(1, 1, 1).normalize()
scene.add(light)

const loader = new GLTFLoader()
loader.load('/assets/models/horse.glb', gltf => {
  mesh = gltf.scene.children[0]
  mesh.scale.set(1.5, 1.5, 1.5)
  scene.add(mesh)
  mixer = new THREE.AnimationMixer(mesh)
  mixer.clipAction(gltf.animations[0]).setDuration(1).play()
})

function render() {
  theta += 0.1
  camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta))
  camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta))
  camera.lookAt(camera.target)

  if (mixer) {
    const time = Date.now()
    mixer.update((time - prevTime) * 0.001)
    prevTime = time
  }
  renderer.render(scene, camera)
}

void function animate() {
  requestAnimationFrame(animate)
  render()
}()
