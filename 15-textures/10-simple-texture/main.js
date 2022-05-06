import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer } from '/utils/scene.js'

const loader = new THREE.TextureLoader()

camera.position.z = 100

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(40, 40, 40),
  new THREE.MeshBasicMaterial({ map: loader.load('/assets/textures/crate.gif') })
)
scene.add(cube)

void function render() {
  window.requestAnimationFrame(render)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}()
