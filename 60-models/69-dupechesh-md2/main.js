// https://threejs.org/examples/webgl_loader_md2.html
// https://threejs.org/examples/webgl_loader_md2_control.html
import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { MD2Loader } from '/node_modules/three108/examples/jsm/loaders/MD2Loader.js'

let mixer, currentAnimation, a = 0

createOrbitControls()
camera.position.set(10, 10, 50)

const texture = new THREE.TextureLoader().load('/assets/models/ogro/skins/arboshak.png')
const loader = new MD2Loader()

// ogro i ratamahatta
loader.load('/assets/models/ogro/ogro.md2', geometry => {
  const { animations } = geometry

  const material = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false, map: texture, morphTargets: true, morphNormals: true })
  const mesh = new THREE.Mesh(geometry, material)

  mixer = new THREE.AnimationMixer(mesh)
  currentAnimation = animations[0]
  mixer.clipAction(currentAnimation).play()
  scene.add(mesh)

  document.addEventListener('click', () => {
    if (currentAnimation) mixer.clipAction(currentAnimation).stop()
    currentAnimation = animations[++a % animations.length]
    console.log(currentAnimation)
    mixer.clipAction(currentAnimation).play()
  })
})

void function render() {
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()
